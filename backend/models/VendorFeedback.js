const mongoose = require('mongoose');

const vendorFeedbackSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 2000 },
}, { timestamps: true });

vendorFeedbackSchema.index({ vendor: 1, createdAt: -1 });

module.exports = mongoose.model('VendorFeedback', vendorFeedbackSchema);

