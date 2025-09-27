const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['card', 'bank', 'wallet'], default: 'wallet' },
  paidDate: { type: Date },
  notes: String
}, { timestamps: true });

repaymentSchema.index({ borrowerId: 1, helperId: 1, dueDate: 1, status: 1 });

module.exports = mongoose.model('Repayment', repaymentSchema);

