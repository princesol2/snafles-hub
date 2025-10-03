const mongoose = require('mongoose');

const obligationSchema = new mongoose.Schema({
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  amountOutstanding: { type: Number, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HelperPointsObligation', obligationSchema);

