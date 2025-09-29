const mongoose = require('mongoose');

const secondHandProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String, required: true }],
  category: { type: String, required: true, enum: ['Jewelry', 'Decor', 'Clothing', 'Accessories', 'Home', 'Art'] },
  condition: { type: String, enum: ['like_new', 'good', 'fair'], default: 'good' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: Number, default: 1, min: 0 },
  isActive: { type: Boolean, default: true },
  approved: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

secondHandProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
secondHandProductSchema.index({ category: 1 });
secondHandProductSchema.index({ seller: 1 });
secondHandProductSchema.index({ approved: 1, isActive: 1 });

module.exports = mongoose.model('SecondHandProduct', secondHandProductSchema);

