const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  kind: {
    type: String,
    enum: ['NEW', 'SECOND_HAND'],
    default: 'NEW'
  },
  condition: {
    type: String,
    enum: ['Like New', 'Good', 'Fair', 'Needs Repair'],
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Jewelry', 'Decor', 'Clothing', 'Accessories', 'Home', 'Art']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  shipping: {
    type: {
      type: String,
      enum: ['FLAT', 'PICKUP_ONLY'],
      default: 'FLAT'
    },
    amount: { type: Number, default: 0 },
    city: { type: String }
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  variants: [{
    name: String,
    price: Number,
    stock: Number
  }],
  specifications: {
    type: Map,
    of: String
  },
  customerReviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  negotiable: {
    type: Boolean,
    default: true
  },
  minOfferRatio: {
    type: Number,
    default: 0.9,
    min: 0.1,
    max: 1
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ approved: 1 });
productSchema.index({ negotiable: 1 });

module.exports = mongoose.model('Product', productSchema);
