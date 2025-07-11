// controllers/requestController.js
const Request = require('../models/Request');

/**
 * @desc   
 * @route   POST /api/requests
 * @access  Public (or protect with middleware as needed)
 */
exports.createRequest = async (req, res) => {
  try {
    const {
      requestId,
      requestBy,
      amount,
      approver,
      description,
      initiatedOn,
      requiredOn,
      status
    } = req.body;

    // You could add validation here (e.g. ensure requestId isn’t already used, etc.)
    const newReq = new Request({
      requestId,
      requestBy,
      amount,
      approver,
      description,
      initiatedOn,
      requiredOn,
      status
    });

    const saved = await newReq.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    // if it’s a duplicate requestId, Mongoose will throw a validation error
    return res.status(400).json({ error: err.message });
  }
};

/**
 * @desc    Get all requests
 * @route   GET /api/requests
 * @access  Public
 */
exports.getAllRequests = async (req, res) => {
  try {
    const all = await Request.find().sort({ initiatedOn: -1 });
    return res.status(200).json(all);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Get a single request by Mongo _id or requestId
 * @route   GET /api/requests/:id
 * @access  Public
 */
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to look up either by MongoDB _id or by requestId
    let request = null;

    // if it’s a valid ObjectId, try that first
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      request = await Request.findById(id);
    }

    // If not found by _id or id wasn’t an ObjectId, try requestId:
    if (!request) {
      request = await Request.findOne({ requestId: id });
    }

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json(request);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Update a request (e.g. change status, amount, etc.)
 * @route   PUT /api/requests/:id
 * @access  Public (or protected)
 */
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // We allow updating any field except requestId (you could block that if desired)
    const updated = await Request.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * @desc    Delete a request
 * @route   DELETE /api/requests/:id
 * @access  Public (or protected)
 */
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Request.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Request not found' });
    }
    return res.status(200).json({ message: 'Request deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
