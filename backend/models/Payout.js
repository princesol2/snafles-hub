const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amountGross: { type: Number, required: true },
  commissionPct: { type: Number, default: 5 },
  commissionAmt: { type: Number, required: true },
  amountNet: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);

