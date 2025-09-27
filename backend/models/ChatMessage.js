const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'offer'],
    default: 'text'
  },
  message: { type: String },
  amount: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'none'],
    default: 'none'
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

chatMessageSchema.index({ productId: 1, buyerId: 1, sellerId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

