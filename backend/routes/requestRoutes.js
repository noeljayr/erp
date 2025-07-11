const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Excel = require('exceljs');

const generateUniqueRequestNumber = async () => {
  const min = 10000;
  const max = 99999;
  let unique = false;
  let attempt = 0;
  let number;

  while (!unique && attempt < 10) {
    number = Math.floor(Math.random() * (max - min + 1)) + min;
    const exists = await Request.exists({ requestNumber: number });
    if (!exists) {
      unique = true;
    }
    attempt++;
  }

  if (!unique) {
    throw new Error(
      'Failed to generate a unique request number after multiple attempts.'
    );
  }

  return number;
};

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const filter = {};

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Employees can only see their own requests
    if (req.user.role !== 'Partner') {
      filter.requestBy = req.user.id;
    }

    // Build search filter if a non-empty search string is provided
    if (typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      const orFilters = [{ purpose: searchRegex }];

      // Amount search: if the search term is a number, match amount exactly
      const amountValue = parseFloat(search);
      if (!isNaN(amountValue)) {
        orFilters.push({ amount: amountValue });
      }

      // Name search: find users whose first or last name match
      const matchedUsers = await User.find(
        { $or: [{ first_name: searchRegex }, { last_name: searchRegex }] },
        'user_id'
      );
      const matchedIds = matchedUsers.map((u) => u.user_id);

      if (matchedIds.length) {
        orFilters.push({ requestBy: { $in: matchedIds } });
        orFilters.push({ approverId: { $in: matchedIds } });
      }

      // Attach the $or filter
      filter.$or = orFilters;
    }

    // Pagination
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const reqLimit = parseInt(limit, 10);

    // Execute queries in parallel
    const [requests, total, statusCounts] = await Promise.all([
      Request.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(reqLimit),
      Request.countDocuments(filter),
      // Status counts with same role-based access
      Request.aggregate([
        {
          $match: {
            ...(req.user.role !== 'Partner' ? { requestBy: req.user.id } : {}),
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Convert statusCounts to an object { Pending: X, Approved: Y, ... }
    const statusSummary = {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
    };
    statusCounts.forEach((item) => {
      statusSummary[item._id] = item.count;
    });

    // Collect user IDs to populate
    const approverIds = requests.map((r) => r.approverId);
    const requesterIds = requests.map((r) => r.requestBy);
    const allUserIds = [...new Set([...approverIds, ...requesterIds])];

    // Fetch user details
    const users = await User.find({ user_id: { $in: allUserIds } });
    const userMap = users.reduce((acc, u) => {
      acc[u.user_id] = u;
      return acc;
    }, {});

    // Build final result
    const data = requests.map((r) => ({
      ...r.toObject(),
      approver: userMap[r.approverId] || null,
      requestedBy: userMap[r.requestBy] || null,
    }));

    // Respond
    res.status(200).json({
      page: parseInt(page, 10),
      limit: reqLimit,
      total,
      totalPages: Math.ceil(total / reqLimit),
      statusCounts: statusSummary,
      data,
    });
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/requests/:id
router.get('/export', async (req, res) => {
  try {
    // 1. Only “Approved” requests:
    const filter = { status: 'Approved' };

    // 2. Enforce permissions (same as your list endpoint):
    if (req.user.role !== 'Partner') {
      filter.requestBy = req.user.id;
    }

    // 3. Fetch requests & user‑info:
    const requests = await Request.find(filter).sort({ initiatedOn: -1 });
    const userIds = [
      ...new Set(requests.flatMap((r) => [r.requestBy, r.approverId])),
    ];
    const users = await User.find({ user_id: { $in: userIds } });
    const userMap = users.reduce((m, u) => {
      m[u.user_id] = u;
      return m;
    }, {});

    // 4. Build workbook
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Approved Requests');

    // 5. Define columns exactly as you want them:
    ws.columns = [
      { header: 'Requested By', key: 'requestedBy', width: 25 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Approved By', key: 'approvedBy', width: 25 },
      { header: 'Purpose', key: 'purpose', width: 30 },
      { header: 'Date', key: 'date', width: 20 },
    ];

    // 6. Push rows
    requests.forEach((r) => {
      const reqUser = userMap[r.requestBy];
      const apprUser = userMap[r.approverId];

      ws.addRow({
        requestedBy: `${reqUser.first_name} ${reqUser.last_name}`,
        amount: `${r.currency} ${r.amount.toLocaleString()}`,
        approvedBy: apprUser
          ? `${apprUser.first_name} ${apprUser.last_name}`
          : '',
        purpose: r.purpose,
        date: r.initiatedOn.toISOString().split('T')[0],
      });
    });

    // 7. Format “Amount” column as text (so currency strings don’t get auto‑parsed):
    ws.getColumn('amount').eachCell((cell) => {
      cell.numFmt = '@';
    });

    // 8. Stream it back:
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="approved-requests.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    res.status(500).json({ error: 'Could not export data' });
  }
});

router.patch('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status' });
    }

    // Fetch the request
    const request = await Request.findById(_id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Only the selected approver can update the status
    if (req.user.id !== request.approverId) {
      return res.status(403).json({ error: 'Not authorized to update status' });
    }

    // Update and save
    request.status = status;
    await request.save();

    // Optionally, populate approver and requester details
    const [approver, requester] = await Promise.all([
      User.findOne({ user_id: request.approverId }),
      User.findOne({ user_id: request.requestBy }),
    ]);

    res.status(200).json({
      ...request.toObject(),
      approver: approver || null,
      requestedBy: requester || null,
    });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.get('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const request = await Request.findById(_id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // Access control
    if (req.user.role !== 'Partner' && request.requestBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Fetch approver and requester user data
    const [approver, requester] = await Promise.all([
      User.findOne({ user_id: request.approverId }),
      User.findOne({ user_id: request.requestBy }),
    ]);

    res.status(200).json({
      ...request.toObject(),
      approver: approver || null,
      requestedBy: requester || null,
    });
  } catch (err) {
    console.error('Error getting request by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/', async (req, res) => {
  try {
    const { amount, currency, description, purpose, requiredOn, approverId } =
      req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const requestNumber = await generateUniqueRequestNumber();

    const newRequest = new Request({
      requestBy: req.user.id,
      approverId,
      amount,
      currency,
      description,
      purpose,
      requestNumber,
      requiredOn,
    });

    await newRequest.validate();
    const savedRequest = await newRequest.save();

    const approver = await User.findOne({ user_id: savedRequest.approverId });

    res.status(200).json({
      _id: savedRequest._id, // explicitly include _id
      ...savedRequest.toObject(),
      approver: approver || null,
    });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { amount, currency, description, purpose, requiredOn, approverId } =
      req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const requestNumber = await generateUniqueRequestNumber();

    const newRequest = new Request({
      requestBy: req.user.id,
      approverId,
      amount,
      currency,
      description,
      purpose,
      requestNumber,
      requiredOn,
    });

    await newRequest.validate();
    const savedRequest = await newRequest.save();

    const approver = await User.findOne({ user_id: savedRequest.approverId });

    res.status(200).json({
      ...savedRequest.toObject(),
      approver: approver || null,
    });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});

module.exports = router;
