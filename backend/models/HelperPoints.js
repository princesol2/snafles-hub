const mongoose = require('mongoose');

const helperPointsTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['topup', 'help', 'reimburse'],
    required: true
  },
  amount: { type: Number, required: true },
  helperUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const helperPointsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
  balance: { type: Number, default: 0 },
  transactions: { type: [helperPointsTransactionSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('HelperPoints', helperPointsSchema);

