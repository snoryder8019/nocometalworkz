const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  service: { type: String },
  message: { type: String },
  ip: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'ncmw_submissions' });

module.exports = mongoose.model('NcmwSubmission', SubmissionSchema);
