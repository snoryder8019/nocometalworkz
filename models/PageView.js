const mongoose = require('mongoose');

const PageViewSchema = new mongoose.Schema({
  path: { type: String, default: '/' },
  ip: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'ncmw_pageviews' });

module.exports = mongoose.model('NcmwPageView', PageViewSchema);
