const mongoose = require('mongoose');

const accountDeletionRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedAt: { type: Date }
}, { timestamps: true });

accountDeletionRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('AccountDeletionRequest', accountDeletionRequestSchema);

