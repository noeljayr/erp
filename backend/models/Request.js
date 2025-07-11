const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');



const RequestSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },

    requestId: {
      type: String,
      default: uuidv4,
    },

    requestNumber: {
      type: Number,
      unique: true,
      required: true,
    },

    requestBy: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      enum: ['MWK', 'USD'],
    },

    approverId: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },

    initiatedOn: {
      type: Date,
      required: true,
      default: Date.now,
    },

    requiredOn: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    _id: false, // to allow custom _id (UUID)
  }
);

module.exports = mongoose.model('Request', RequestSchema);
