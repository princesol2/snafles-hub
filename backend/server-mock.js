const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'demo@snafles.com',
    password: 'demo123',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Demo Street',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90210',
      country: 'US'
    },
    role: 'customer',
    loyaltyPoints: 1250,
    preferences: {
      newsletter: true,
      smsNotifications: false
    },
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'Test User',
    email: 'testexample@gmail.com',
    password: '123',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Test Avenue',
      city: 'Test City',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    role: 'customer',
    loyaltyPoints: 0,
    preferences: {
      newsletter: false,
      smsNotifications: false
    },
    lastLogin: new Date()
  },
  {
    id: 'vendor-001',
    name: 'Artisan Crafts Co.',
    email: 'vendor@artisancrafts.com',
    password: 'vendor123',
    phone: '+91 98765 43210',
    address: {
      street: '123 Artisan Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    role: 'vendor',
    businessName: 'Artisan Crafts Co.',
    businessType: 'Handicrafts',
    isVerified: true,
    lastLogin: new Date()
  },
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@snafles.com',
    password: 'admin123',
    phone: '+1 (555) 000-0000',
    address: {
      street: 'Admin Street',
      city: 'Admin City',
      state: 'CA',
      zipCode: '00000',
      country: 'US'
    },
    role: 'admin',
    lastLogin: new Date()
  },
  // Additional vendor users
  {
    id: 'vendor-003',
    name: 'TechGear Pro',
    email: 'vendor3@techgearpro.com',
    password: 'vendor123',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US'
    },
    role: 'vendor',
    businessName: 'TechGear Pro',
    businessType: 'Electronics',
    isVerified: true,
    lastLogin: new Date()
  },
  {
    id: 'vendor-004',
    name: 'FitLife Store',
    email: 'vendor4@fitlifestore.com',
    password: 'vendor123',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Fitness Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US'
    },
    role: 'vendor',
    businessName: 'FitLife Store',
    businessType: 'Sports & Fitness',
    isVerified: true,
    lastLogin: new Date()
  },
  {
    id: 'vendor-005',
    name: 'BookWorm Publishers',
    email: 'vendor5@bookwormpub.com',
    password: 'vendor123',
    phone: '+1 (555) 456-7890',
    address: {
      street: '789 Book Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    role: 'vendor',
    businessName: 'BookWorm Publishers',
    businessType: 'Books & Media',
    isVerified: true,
    lastLogin: new Date()
  }
];

const mockProducts = [
  {
    id: "jewelry-001",
    name: "Handmade Pearl Necklace",
    description: "Beautiful handmade pearl necklace with silver chain",
    detailedDescription: "This exquisite pearl necklace features high-quality freshwater pearls strung on a sterling silver chain. Each pearl is carefully selected for its luster and shape, creating a timeless piece that complements any outfit.",
    price: 89.99,
    originalPrice: 120.00,
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"],
    category: "Jewelry",
    vendor: "vendor-001",
    stock: 15,
    rating: 4.8,
    reviews: 23,
    featured: true,
    tags: ["pearl", "necklace", "handmade", "silver"],
    specifications: {
      material: "Freshwater Pearls, Sterling Silver",
      length: "18 inches",
      weight: "25g"
    },
    customerReviews: [
      {
        user: "1",
        name: "Sarah Johnson",
        rating: 5,
        comment: "Absolutely beautiful! The pearls are so lustrous and the craftsmanship is excellent.",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "decor-001",
    name: "Ceramic Vase",
    description: "Modern ceramic vase perfect for home decoration",
    detailedDescription: "This contemporary ceramic vase features a sleek design with a matte finish. Perfect for displaying fresh flowers or as a standalone decorative piece.",
    price: 45.99,
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"],
    category: "Decor",
    vendor: "vendor-002",
    stock: 8,
    rating: 4.7,
    reviews: 12,
    featured: true,
    tags: ["ceramic", "vase", "modern", "decor"],
    specifications: {
      material: "Ceramic",
      height: "12 inches",
      diameter: "6 inches"
    },
    customerReviews: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "clothing-001",
    name: "Boho Silver Earrings",
    description: "Stylish boho silver earrings with intricate design",
    detailedDescription: "These stunning boho-style earrings feature intricate silver work with a bohemian flair. Perfect for adding a touch of elegance to any outfit.",
    price: 25.99,
    images: ["https://images.unsplash.com/photo-1635767798704-3e94c9e53928?w=400&h=400&fit=crop"],
    category: "Jewelry",
    vendor: "vendor-001",
    stock: 28,
    rating: 4.6,
    reviews: 15,
    featured: false,
    tags: ["earrings", "silver", "boho", "jewelry"],
    specifications: {
      material: "Sterling Silver",
      length: "2 inches",
      weight: "8g"
    },
    customerReviews: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "clothing-002",
    name: "Handwoven Cotton Tunic",
    description: "Beautiful handwoven cotton tunic with traditional patterns",
    detailedDescription: "This elegant tunic is crafted from premium handwoven cotton with intricate traditional patterns. Perfect for casual wear or special occasions. Available in multiple sizes and colors.",
    price: 45.99,
    originalPrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=60"
    ],
    category: "Clothing",
    vendor: "vendor-001",
    stock: 15,
    rating: 4.8,
    reviews: 22,
    featured: true,
    tags: ["tunic", "cotton", "handwoven", "traditional", "clothing"],
    specifications: {
      material: "100% Cotton",
      care: "Machine wash cold, hang dry",
      origin: "Handwoven in India"
    },
    sizes: [
      { size: "XS", stock: 2, price: 45.99 },
      { size: "S", stock: 4, price: 45.99 },
      { size: "M", stock: 5, price: 45.99 },
      { size: "L", stock: 3, price: 45.99 },
      { size: "XL", stock: 1, price: 45.99 }
    ],
    colors: [
      { name: "Navy Blue", hex: "#1e3a8a", stock: 8 },
      { name: "Terracotta", hex: "#c2410c", stock: 4 },
      { name: "Sage Green", hex: "#059669", stock: 3 }
    ],
    customerReviews: [
      {
        user: "2",
        name: "Maria Garcia",
        rating: 5,
        comment: "Absolutely love this tunic! The quality is amazing and it's so comfortable.",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Electronics
  {
    id: "electronics-001",
    name: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with noise cancellation",
    detailedDescription: "Experience crystal-clear audio with these premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals.",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"
    ],
    category: "Electronics",
    vendor: "vendor-003",
    stock: 25,
    rating: 4.7,
    reviews: 156,
    featured: true,
    tags: ["headphones", "wireless", "bluetooth", "noise-cancellation"],
    specifications: {
      battery: "30 hours",
      connectivity: "Bluetooth 5.0",
      weight: "250g",
      warranty: "2 years"
    },
    customerReviews: [
      {
        user: "1",
        name: "Sarah Johnson",
        rating: 5,
        comment: "Amazing sound quality and very comfortable!",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Home & Garden
  {
    id: "home-001",
    name: "Ceramic Plant Pot Set",
    description: "Beautiful handcrafted ceramic plant pots",
    detailedDescription: "Add elegance to your home with this set of handcrafted ceramic plant pots. Each pot is unique, featuring beautiful glazes and modern designs. Perfect for indoor plants and succulents.",
    price: 45.99,
    originalPrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop"
    ],
    category: "Home & Garden",
    vendor: "vendor-001",
    stock: 18,
    rating: 4.6,
    reviews: 89,
    featured: false,
    tags: ["pots", "ceramic", "plants", "home-decor"],
    specifications: {
      material: "Ceramic",
      dimensions: "Various sizes",
      drainage: "Yes",
      care: "Hand wash only"
    },
    customerReviews: [
      {
        user: "2",
        name: "Maria Garcia",
        rating: 4,
        comment: "Beautiful pots, my plants love them!",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Sports & Fitness
  {
    id: "sports-001",
    name: "Yoga Mat Premium",
    description: "Non-slip premium yoga mat for all fitness levels",
    detailedDescription: "Practice yoga and fitness with confidence using this premium non-slip yoga mat. Made from eco-friendly materials, it provides excellent grip and cushioning for all types of exercises.",
    price: 39.99,
    originalPrice: 49.99,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
    ],
    category: "Sports & Fitness",
    vendor: "vendor-004",
    stock: 32,
    rating: 4.8,
    reviews: 203,
    featured: true,
    tags: ["yoga", "fitness", "mat", "exercise"],
    specifications: {
      material: "Eco-friendly TPE",
      thickness: "6mm",
      dimensions: "183cm x 61cm",
      weight: "1.2kg"
    },
    customerReviews: [
      {
        user: "3",
        name: "Emily Rodriguez",
        rating: 5,
        comment: "Perfect grip and very comfortable!",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Books & Media
  {
    id: "books-001",
    name: "The Art of Digital Marketing",
    description: "Complete guide to modern digital marketing strategies",
    detailedDescription: "Master the art of digital marketing with this comprehensive guide. Learn about SEO, social media marketing, content strategy, and more. Perfect for entrepreneurs and marketing professionals.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    ],
    category: "Books & Media",
    vendor: "vendor-005",
    stock: 45,
    rating: 4.5,
    reviews: 67,
    featured: false,
    tags: ["book", "marketing", "digital", "business"],
    specifications: {
      pages: "320",
      format: "Paperback",
      language: "English",
      publisher: "Tech Books Inc."
    },
    customerReviews: [
      {
        user: "1",
        name: "Sarah Johnson",
        rating: 4,
        comment: "Very informative and well-written!",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Tanmay Arora Products
  {
    id: "jewelry-tanmay-001",
    name: "Traditional Kundan Necklace Set",
    description: "Exquisite traditional Indian Kundan necklace with matching earrings and bracelet",
    detailedDescription: "Handcrafted by master jeweler Tanmay Arora, this stunning Kundan set features authentic Kundan stones set in 22k gold. The intricate workmanship showcases traditional Indian jewelry-making techniques passed down through generations.",
    price: 45000,
    originalPrice: 55000,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596944924616-7b384c8c4e3b?w=600&h=600&fit=crop"
    ],
    category: "Jewelry",
    vendor: "vendor-006",
    stock: 5,
    rating: 4.9,
    reviews: 45,
    tags: ["Traditional", "Kundan", "Gold", "Wedding", "Festive"],
    specifications: {
      material: "22k Gold with Kundan stones",
      weight: "85 grams",
      color: "Gold",
      occasion: "Wedding, Festive"
    },
    customerReviews: [
      {
        user: "1",
        name: "Priya Sharma",
        rating: 5,
        comment: "Absolutely stunning! The craftsmanship is exceptional. Perfect for my wedding!",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "jewelry-tanmay-002",
    name: "Modern Gold Chain with Pendant",
    description: "Contemporary gold chain with a unique geometric pendant design",
    detailedDescription: "A perfect blend of traditional goldsmithing and modern design. This elegant chain features a handcrafted geometric pendant that reflects contemporary aesthetics while maintaining the quality and purity of traditional Indian gold jewelry.",
    price: 25000,
    originalPrice: 30000,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop"
    ],
    category: "Jewelry",
    vendor: "vendor-006",
    stock: 12,
    rating: 4.8,
    reviews: 32,
    tags: ["Modern", "Gold", "Chain", "Pendant", "Contemporary"],
    specifications: {
      material: "18k Gold",
      weight: "45 grams",
      color: "Gold",
      occasion: "Daily wear, Party"
    },
    customerReviews: [
      {
        user: "2",
        name: "Rajesh Kumar",
        rating: 5,
        comment: "Beautiful modern design with excellent quality. Highly recommended!",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Bani Makeovers Products
  {
    id: "beauty-bani-001",
    name: "Premium Makeup Kit - Complete Set",
    description: "Professional makeup kit with all essential cosmetics for a complete look",
    detailedDescription: "Curated by professional makeup artist Bani, this comprehensive kit includes high-quality foundations, eyeshadows, lipsticks, and brushes. Perfect for both beginners and professionals, with shades suitable for all skin tones.",
    price: 3500,
    originalPrice: 4500,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop"
    ],
    category: "Beauty & Cosmetics",
    vendor: "vendor-007",
    stock: 25,
    rating: 4.8,
    reviews: 67,
    tags: ["Makeup", "Professional", "Complete Kit", "All Skin Tones"],
    specifications: {
      type: "Makeup Kit",
      items: "15 pieces",
      skinType: "All skin types",
      finish: "Matte and Glossy"
    },
    customerReviews: [
      {
        user: "1",
        name: "Anita Singh",
        rating: 5,
        comment: "Amazing quality! The colors are perfect and long-lasting. Bani's expertise really shows!",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "beauty-bani-002",
    name: "Natural Skincare Routine Set",
    description: "Complete natural skincare routine with organic ingredients",
    detailedDescription: "Developed by beauty expert Bani, this skincare set includes cleanser, toner, serum, and moisturizer made with natural and organic ingredients. Suitable for all skin types, especially sensitive skin.",
    price: 2800,
    originalPrice: 3500,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop"
    ],
    category: "Beauty & Cosmetics",
    vendor: "vendor-007",
    stock: 18,
    rating: 4.7,
    reviews: 43,
    tags: ["Skincare", "Natural", "Organic", "Sensitive Skin"],
    specifications: {
      type: "Skincare Set",
      items: "4 products",
      skinType: "All skin types",
      ingredients: "Natural and Organic"
    },
    customerReviews: [
      {
        user: "2",
        name: "Meera Patel",
        rating: 4,
        comment: "Great natural products! My skin feels so much better after using this routine.",
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockVendors = [
  {
    id: "vendor-001",
    name: "Artisan Crafts Co.",
    description: "Traditional Indian handicrafts and jewelry",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    location: "Mumbai, India",
    categories: ["Jewelry", "Art"],
    rating: 4.8,
    reviews: 45,
    contact: {
      email: "contact@artisancrafts.com",
      phone: "+91 98765 43210",
      website: "https://artisancrafts.com",
      socialMedia: {
        facebook: "https://facebook.com/artisancrafts",
        instagram: "https://instagram.com/artisancrafts"
      }
    },
    isActive: true,
    isVerified: true,
    joinDate: new Date()
  },
  {
    id: "vendor-002",
    name: "Creative Home Studio",
    description: "Modern home decor and accessories",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    location: "Delhi, India",
    categories: ["Decor", "Home"],
    rating: 4.7,
    reviews: 32,
    contact: {
      email: "hello@creativehomestudio.com",
      phone: "+91 98765 43211",
      website: "https://creativehomestudio.com",
      socialMedia: {
        facebook: "https://facebook.com/creativehomestudio",
        instagram: "https://instagram.com/creativehomestudio"
      }
    },
    isActive: true,
    isVerified: true,
    joinDate: new Date()
  },
  {
    id: "vendor-003",
    name: "TechGear Pro",
    description: "Premium electronics and tech accessories",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    location: "San Francisco, CA",
    categories: ["Electronics", "Tech Accessories"],
    rating: 4.9,
    reviews: 234,
    contact: {
      email: "support@techgearpro.com",
      phone: "+1 (555) 123-4567",
      website: "https://techgearpro.com",
      socialMedia: {
        facebook: "https://facebook.com/techgearpro",
        instagram: "https://instagram.com/techgearpro"
      }
    },
    isActive: true,
    isVerified: true,
    joinDate: new Date()
  },
  {
    id: "vendor-004",
    name: "FitLife Store",
    description: "Sports and fitness equipment for all levels",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    location: "Los Angeles, CA",
    categories: ["Sports & Fitness", "Exercise Equipment"],
    rating: 4.7,
    reviews: 189,
    contact: {
      email: "info@fitlifestore.com",
      phone: "+1 (555) 987-6543",
      website: "https://fitlifestore.com",
      socialMedia: {
        facebook: "https://facebook.com/fitlifestore",
        instagram: "https://instagram.com/fitlifestore"
      }
    },
    isActive: true,
    isVerified: true,
    joinDate: new Date()
  },
  {
    id: "vendor-005",
    name: "BookWorm Publishers",
    description: "Educational and professional books",
    logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    location: "New York, NY",
    categories: ["Books & Media", "Education"],
    rating: 4.6,
    reviews: 156,
    contact: {
      email: "orders@bookwormpub.com",
      phone: "+1 (555) 456-7890",
      website: "https://bookwormpub.com",
      socialMedia: {
        facebook: "https://facebook.com/bookwormpub",
        instagram: "https://instagram.com/bookwormpub"
      }
    },
    isActive: true,
    isVerified: true,
    joinDate: new Date()
  },
  {
    id: "vendor-006",
    name: "Tanmay Arora",
    description: "Master craftsman specializing in traditional Indian jewelry with a modern twist. Known for intricate designs and premium quality materials.",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop",
    location: "New Delhi, India",
    categories: ["Jewelry", "Accessories"],
    rating: 4.9,
    reviews: 250,
    contact: {
      email: "orders@tanmayarora.com",
      phone: "+91 98765 43210",
      website: "https://tanmayarora.com",
      socialMedia: {
        facebook: "https://facebook.com/tanmayarorajewelry",
        instagram: "https://instagram.com/tanmay_arora_jewelry",
        youtube: "https://youtube.com/tanmayarora"
      }
    },
    isActive: true,
    isVerified: true,
    joinDate: new Date()
  },
  {
    id: "vendor-007",
    name: "Bani Makeovers",
    description: "Professional makeup artist and beauty consultant offering premium cosmetics and personalized beauty solutions for all skin types.",
    logo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop",
    location: "Mumbai, India",
    categories: ["Beauty & Cosmetics", "Skincare"],
    rating: 4.8,
    reviews: 320,
    contact: {
      email: "orders@banimakeovers.com",
      phone: "+91 98765 12345",
      website: "https://banimakeovers.com",
      socialMedia: {
        facebook: "https://facebook.com/banimakeovers",
        instagram: "https://instagram.com/bani_makeovers",
        youtube: "https://youtube.com/banimakeovers"
      }
    },
    isActive: true,
    isVerified: true,
    joinDate: new Date()
  }
];

// JWT Secret (in production, use a secure secret)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Mock API Server Running'
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, hash this
      phone,
      address,
      role: 'customer',
      loyaltyPoints: 0,
      preferences: {
        newsletter: false,
        smsNotifications: false
      },
      lastLogin: new Date()
    };
    
    mockUsers.push(newUser);
    
    // Generate token
    const token = generateToken(newUser.id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        address: req.user.address,
        loyaltyPoints: req.user.loyaltyPoints,
        preferences: req.user.preferences
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', auth, (req, res) => {
  try {
    const updates = req.body || {};
    const idx = mockUsers.findIndex(u => u.id === req.user.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Merge basic fields
    const allowed = ['name', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 'preferences'];
    const updatedUser = { ...mockUsers[idx] };
    allowed.forEach((k) => {
      if (updates[k] !== undefined) updatedUser[k] = updates[k];
    });
    mockUsers[idx] = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        zipCode: updatedUser.zipCode,
        country: updatedUser.country,
        loyaltyPoints: updatedUser.loyaltyPoints,
        preferences: updatedUser.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Change password (mocked)
app.post('/api/auth/change-password', auth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    
    const user = mockUsers.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    if (currentPassword && user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

// Products routes
app.get('/api/products', (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, featured } = req.query;
    
    let filteredProducts = [...mockProducts];
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }
    
    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProducts.length / parseInt(limit)),
        totalProducts: filteredProducts.length,
        hasNext: endIndex < filteredProducts.length,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = mockProducts.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add vendor info
    const vendor = mockVendors.find(v => v.id === product.vendor);
    const productWithVendor = {
      ...product,
      vendor: vendor
    };
    
    res.json(productWithVendor);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// Vendors routes
app.get('/api/vendors', (req, res) => {
  try {
    const { page = 1, limit = 20, category, location, verified } = req.query;
    
    let filteredVendors = [...mockVendors];
    
    if (category) {
      filteredVendors = filteredVendors.filter(v => v.categories.includes(category));
    }
    
    if (location) {
      filteredVendors = filteredVendors.filter(v => 
        v.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (verified === 'true') {
      filteredVendors = filteredVendors.filter(v => v.isVerified);
    }
    
    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedVendors = filteredVendors.slice(startIndex, endIndex);
    
    res.json({
      vendors: paginatedVendors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredVendors.length / parseInt(limit)),
        totalVendors: filteredVendors.length,
        hasNext: endIndex < filteredVendors.length,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error while fetching vendors' });
  }
});

app.get('/api/vendors/:id', (req, res) => {
  try {
    const vendor = mockVendors.find(v => v.id === req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    // Get vendor's products
    const products = mockProducts.filter(p => p.vendor === req.params.id);
    
    res.json({
      vendor,
      products
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Server error while fetching vendor' });
  }
});

// Get products for a vendor (by vendor id)
app.get('/api/vendors/:id/products', (req, res) => {
  try {
    const products = mockProducts.filter(p => p.vendor === req.params.id);
    res.json(products);
  } catch (error) {
    console.error('Get vendor products error:', error);
    res.status(500).json({ message: 'Server error while fetching vendor products' });
  }
});

// Update vendor profile (mock); requires vendor auth
app.put('/api/vendors/profile', auth, (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied. Vendor role required.' });
    }
    const updates = req.body || {};
    const idx = mockUsers.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.status(404).json({ message: 'Vendor not found' });

    const allowed = ['name', 'phone', 'address', 'businessName', 'businessType'];
    const updated = { ...mockUsers[idx] };
    allowed.forEach((k) => {
      if (updates[k] !== undefined) updated[k] = updates[k];
    });
    mockUsers[idx] = updated;
    res.json({ message: 'Vendor profile updated successfully', vendor: updated });
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({ message: 'Server error while updating vendor profile' });
  }
});

// Forgot password route
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }
    
    // In a real app, send email here. For development, return success
    res.json({ 
      message: 'Password reset link has been sent to your email.',
      resetUrl: `https://localhost:5174/reset-password/demo-token-${Date.now()}`
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// Reset password route
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { token, password } = req.body;
    
    // In a real app, validate token here
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Update user profile
app.put('/api/auth/profile', auth, (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = mockUsers.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    // Remove password from response
    const { password, ...userResponse } = user;
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Verify password
app.post('/api/auth/verify-password', auth, (req, res) => {
  try {
    const { password } = req.body;
    const user = mockUsers.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isValid = user.password === password;
    res.json({ isValid });
  } catch (error) {
    console.error('Verify password error:', error);
    res.status(500).json({ message: 'Server error verifying password' });
  }
});

// Request password reset
app.post('/api/auth/request-password-reset', (req, res) => {
  try {
    const { email, phone, snaflesId } = req.body;
    
    let user = null;
    if (email) {
      user = mockUsers.find(u => u.email === email);
    } else if (phone) {
      user = mockUsers.find(u => u.phone === phone);
    } else if (snaflesId) {
      user = mockUsers.find(u => u.id === snaflesId);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real app, send reset instructions here
    res.json({ 
      message: 'Password reset instructions sent successfully',
      method: email ? 'email' : phone ? 'phone' : 'snaflesId'
    });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ message: 'Server error requesting password reset' });
  }
});

// Payment routes
app.post('/api/payments/create-payment-intent', auth, (req, res) => {
  try {
    const { amount, currency = 'inr', orderId } = req.body;
    
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      status: 'requires_payment_method',
      orderId: orderId
    };

    res.json({
      message: 'Payment intent created successfully',
      paymentIntent
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error while creating payment intent' });
  }
});

app.post('/api/payments/confirm-payment', auth, (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    
    res.json({
      message: 'Payment confirmed successfully',
      order: {
        id: orderId,
        orderNumber: `ORD-${Date.now()}`,
        status: 'confirmed',
        paymentStatus: 'completed'
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error while confirming payment' });
  }
});

app.get('/api/payments/methods', (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, American Express',
        icon: '💳',
        enabled: true
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Google Pay, PhonePe, Paytm',
        icon: '📱',
        enabled: true
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'All major banks',
        icon: '🏦',
        enabled: true
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: '💰',
        enabled: true
      }
    ];

    res.json({ paymentMethods });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error while fetching payment methods' });
  }
});

// Orders routes
app.get('/api/orders', auth, (req, res) => {
  try {
    const mockOrders = [
      {
        id: 'order-001',
        orderNumber: 'ORD-2024-001',
        user: req.user.id,
        items: [
          {
            product: mockProducts[0],
            quantity: 1,
            price: mockProducts[0].price
          }
        ],
        total: mockProducts[0].price,
        status: 'confirmed',
        payment: {
          status: 'completed',
          method: 'card',
          transactionId: 'txn_123456'
        },
        shipping: {
          address: req.user.address,
          status: 'shipped',
          trackingNumber: 'TRK123456789'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    res.json({ orders: mockOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

app.post('/api/orders', auth, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    const order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Date.now()}`,
      user: req.user.id,
      items,
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      payment: {
        status: 'pending',
        method: paymentMethod
      },
      shipping: {
        address: shippingAddress,
        status: 'pending'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// Upload routes
app.post('/api/upload/single', auth, (req, res) => {
  try {
    // In a real app, handle file upload here
    res.json({
      message: 'File uploaded successfully',
      file: {
        id: `file_${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
        filename: 'uploaded-image.jpg',
        size: 1024000
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error while uploading file' });
  }
});

// Vendor registration route
app.post('/api/auth/vendor-register', (req, res) => {
  try {
    const { name, email, password, phone, businessName, businessType, address } = req.body;
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Vendor already exists with this email' });
    }
    
    // Create new vendor
    const newVendor = {
      id: `vendor-${Date.now()}`,
      name,
      email,
      password, // In real app, hash this
      phone,
      address,
      role: 'vendor',
      businessName,
      businessType,
      isVerified: false,
      lastLogin: new Date()
    };
    
    mockUsers.push(newVendor);
    
    // Generate token
    const token = generateToken(newVendor.id);
    
    res.status(201).json({
      message: 'Vendor registered successfully',
      token,
      user: {
        id: newVendor.id,
        name: newVendor.name,
        email: newVendor.email,
        role: newVendor.role,
        businessName: newVendor.businessName
      }
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({ message: 'Server error during vendor registration' });
  }
});

// Vendor login route
app.post('/api/auth/vendor-login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find vendor
    const vendor = mockUsers.find(u => u.email === email && u.password === password && u.role === 'vendor');
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid vendor credentials' });
    }
    
    // Update last login
    vendor.lastLogin = new Date();
    
    // Generate token
    const token = generateToken(vendor.id);
    
    res.json({
      message: 'Vendor login successful',
      token,
      user: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        businessName: vendor.businessName,
        isVerified: vendor.isVerified
      }
    });
  } catch (error) {
    console.error('Vendor login error:', error);
    res.status(500).json({ message: 'Server error during vendor login' });
  }
});

// Admin login route
app.post('/api/auth/admin-login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin
    const admin = mockUsers.find(u => u.email === email && u.password === password && u.role === 'admin');
    if (!admin) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    
    // Generate token
    const token = generateToken(admin.id);
    
    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Vendor dashboard routes
app.get('/api/vendor/dashboard', auth, (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied. Vendor role required.' });
    }
    
    const vendorProducts = mockProducts.filter(p => p.vendor === req.user.id);
    const vendorOrders = []; // Mock orders for vendor
    
    res.json({
      vendor: req.user,
      stats: {
        totalProducts: vendorProducts.length,
        totalOrders: vendorOrders.length,
        totalRevenue: 0,
        pendingOrders: 0
      },
      recentProducts: vendorProducts.slice(0, 5),
      recentOrders: vendorOrders.slice(0, 5)
    });
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching vendor dashboard' });
  }
});

// Admin dashboard routes
app.get('/api/admin/dashboard', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    res.json({
      admin: req.user,
      stats: {
        totalUsers: mockUsers.filter(u => u.role === 'customer').length,
        totalVendors: mockUsers.filter(u => u.role === 'vendor').length,
        totalProducts: mockProducts.length,
        totalOrders: 0
      },
      recentUsers: mockUsers.filter(u => u.role === 'customer').slice(0, 5),
      recentVendors: mockUsers.filter(u => u.role === 'vendor').slice(0, 5)
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching admin dashboard' });
  }
});

// Chat endpoints
app.get('/api/chat/messages/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    const mockMessages = [
      {
        id: '1',
        productId,
        senderId: '1',
        message: 'Hi! I\'m interested in this item. Is it still available?',
        type: 'text',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '2',
        productId,
        senderId: '2',
        message: 'Yes, it\'s still available! Would you like to make an offer?',
        type: 'text',
        timestamp: new Date(Date.now() - 240000).toISOString()
      },
      {
        id: '3',
        productId,
        senderId: '1',
        message: 'I can offer $45 for it',
        type: 'offer',
        amount: 45,
        status: 'pending',
        timestamp: new Date(Date.now() - 180000).toISOString()
      }
    ];
    
    res.json(mockMessages);
  } catch (error) {
    console.error('Chat messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

app.post('/api/chat/send', (req, res) => {
  try {
    const { productId, sellerId, message, type } = req.body;
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      productId,
      senderId: req.user?.id || '1',
      message,
      type: type || 'text',
      timestamp: new Date().toISOString()
    };
    
    res.json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

app.post('/api/chat/send-offer', (req, res) => {
  try {
    const { productId, sellerId, amount, type } = req.body;
    
    const newOffer = {
      id: `offer_${Date.now()}`,
      productId,
      senderId: req.user?.id || '1',
      message: `I offer $${amount} for this item`,
      type: 'offer',
      amount: parseFloat(amount),
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    res.json({ message: 'Offer sent successfully', data: newOffer });
  } catch (error) {
    console.error('Send offer error:', error);
    res.status(500).json({ message: 'Failed to send offer' });
  }
});

app.post('/api/chat/accept-offer/:messageId', (req, res) => {
  try {
    const { messageId } = req.params;
    res.json({ message: 'Offer accepted successfully' });
  } catch (error) {
    console.error('Accept offer error:', error);
    res.status(500).json({ message: 'Failed to accept offer' });
  }
});

app.post('/api/chat/reject-offer/:messageId', (req, res) => {
  try {
    const { messageId } = req.params;
    res.json({ message: 'Offer rejected' });
  } catch (error) {
    console.error('Reject offer error:', error);
    res.status(500).json({ message: 'Failed to reject offer' });
  }
});

// Bidding endpoints
app.get('/api/bidding/bids/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    const mockBids = [
      {
        id: '1',
        productId,
        bidderId: '1',
        amount: 50,
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '2',
        productId,
        bidderId: '2',
        amount: 55,
        timestamp: new Date(Date.now() - 180000).toISOString()
      },
      {
        id: '3',
        productId,
        bidderId: '3',
        amount: 60,
        timestamp: new Date(Date.now() - 60000).toISOString()
      }
    ];
    
    res.json(mockBids);
  } catch (error) {
    console.error('Bidding error:', error);
    res.status(500).json({ message: 'Failed to fetch bids' });
  }
});

app.post('/api/bidding/place-bid', (req, res) => {
  try {
    const { productId, amount, autoBid, maxBid } = req.body;
    
    const newBid = {
      id: `bid_${Date.now()}`,
      productId,
      bidderId: req.user?.id || '1',
      amount: parseFloat(amount),
      autoBid: autoBid || false,
      maxBid: maxBid ? parseFloat(maxBid) : null,
      timestamp: new Date().toISOString()
    };
    
    res.json({ message: 'Bid placed successfully', data: newBid });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Failed to place bid' });
  }
});

// Peer Assistance endpoints
app.get('/api/assistance/available-helpers', (req, res) => {
  try {
    const mockHelpers = [
      {
        id: '1',
        name: 'Sarah Johnson',
        rating: 4.8,
        assistanceCount: 25,
        responseTime: '2 hours',
        location: 'New York, NY'
      },
      {
        id: '2',
        name: 'Mike Chen',
        rating: 4.9,
        assistanceCount: 42,
        responseTime: '1 hour',
        location: 'Los Angeles, CA'
      },
      {
        id: '3',
        name: 'Emily Davis',
        rating: 4.7,
        assistanceCount: 18,
        responseTime: '3 hours',
        location: 'Chicago, IL'
      }
    ];
    
    res.json(mockHelpers);
  } catch (error) {
    console.error('Available helpers error:', error);
    res.status(500).json({ message: 'Failed to fetch helpers' });
  }
});

app.get('/api/assistance/requests', (req, res) => {
  try {
    const mockRequests = [
      {
        id: '1',
        productId: 'jewelry-001',
        requester: {
          id: '1',
          name: 'John Smith',
          rating: 4.5
        },
        amount: 25,
        repaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Need assistance to purchase this beautiful necklace',
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        productId: 'art-001',
        requester: {
          id: '2',
          name: 'Lisa Brown',
          rating: 4.8
        },
        amount: 40,
        repaymentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Looking for help to buy this amazing painting',
        status: 'pending',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    
    res.json(mockRequests);
  } catch (error) {
    console.error('Assistance requests error:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

app.post('/api/assistance/request', (req, res) => {
  try {
    const { productId, amount, repaymentDate, helperId, message } = req.body;
    
    const newRequest = {
      id: `req_${Date.now()}`,
      productId,
      requesterId: req.user?.id || '1',
      helperId,
      amount: parseFloat(amount),
      repaymentDate,
      message,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    res.json({ message: 'Assistance request sent successfully', data: newRequest });
  } catch (error) {
    console.error('Request assistance error:', error);
    res.status(500).json({ message: 'Failed to request assistance' });
  }
});

app.post('/api/assistance/provide/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    res.json({ message: 'Assistance provided successfully' });
  } catch (error) {
    console.error('Provide assistance error:', error);
    res.status(500).json({ message: 'Failed to provide assistance' });
  }
});

// Helper Points & Rewards endpoints
app.get('/api/rewards/points', (req, res) => {
  try {
    const mockPoints = {
      points: 1250,
      level: 3,
      nextLevelPoints: 500,
      totalAssists: 25,
      totalHelped: 18
    };
    
    res.json(mockPoints);
  } catch (error) {
    console.error('Points error:', error);
    res.status(500).json({ message: 'Failed to fetch points' });
  }
});

app.get('/api/rewards/available', (req, res) => {
  try {
    const mockRewards = [
      {
        id: '1',
        name: '10% Discount',
        description: 'Get 10% off your next purchase',
        type: 'discount',
        pointsCost: 100,
        value: '10%'
      },
      {
        id: '2',
        name: 'Free Shipping',
        description: 'Free shipping on your next order',
        type: 'free_item',
        pointsCost: 50,
        value: '$5.99'
      },
      {
        id: '3',
        name: 'Premium Badge',
        description: 'Show off your premium status',
        type: 'premium',
        pointsCost: 200,
        value: 'Premium'
      },
      {
        id: '4',
        name: 'Exclusive Access',
        description: 'Early access to new features',
        type: 'exclusive',
        pointsCost: 500,
        value: 'Exclusive'
      }
    ];
    
    res.json(mockRewards);
  } catch (error) {
    console.error('Available rewards error:', error);
    res.status(500).json({ message: 'Failed to fetch rewards' });
  }
});

app.get('/api/rewards/redeemed', (req, res) => {
  try {
    const mockRedeemed = [
      {
        id: '1',
        rewardId: '1',
        rewardName: '10% Discount',
        pointsCost: 100,
        redeemedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'used'
      },
      {
        id: '2',
        rewardId: '2',
        rewardName: 'Free Shipping',
        pointsCost: 50,
        redeemedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    ];
    
    res.json(mockRedeemed);
  } catch (error) {
    console.error('Redeemed rewards error:', error);
    res.status(500).json({ message: 'Failed to fetch redeemed rewards' });
  }
});

app.post('/api/rewards/redeem/:rewardId', (req, res) => {
  try {
    const { rewardId } = req.params;
    res.json({ message: 'Reward redeemed successfully' });
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ message: 'Failed to redeem reward' });
  }
});

// Auto Repayment endpoints
app.get('/api/repayment/settings', (req, res) => {
  try {
    const mockSettings = {
      autoRepay: true,
      maxAmount: 100,
      preferredMethod: 'card',
      notificationDays: 3
    };
    
    res.json(mockSettings);
  } catch (error) {
    console.error('Repayment settings error:', error);
    res.status(500).json({ message: 'Failed to fetch repayment settings' });
  }
});

app.put('/api/repayment/settings', (req, res) => {
  try {
    const settings = req.body;
    res.json({ message: 'Repayment settings updated successfully', data: settings });
  } catch (error) {
    console.error('Update repayment settings error:', error);
    res.status(500).json({ message: 'Failed to update repayment settings' });
  }
});

app.get('/api/repayment/pending', (req, res) => {
  try {
    const mockPending = [
      {
        id: '1',
        amount: 25,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        helperName: 'Sarah Johnson',
        productName: 'Handmade Necklace',
        status: 'pending'
      },
      {
        id: '2',
        amount: 40,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        helperName: 'Mike Chen',
        productName: 'Art Painting',
        status: 'pending'
      }
    ];
    
    res.json(mockPending);
  } catch (error) {
    console.error('Pending repayments error:', error);
    res.status(500).json({ message: 'Failed to fetch pending repayments' });
  }
});

app.get('/api/repayment/history', (req, res) => {
  try {
    const mockHistory = [
      {
        id: '1',
        amount: 30,
        paidDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        helperName: 'Emily Davis',
        paymentMethod: 'card',
        status: 'completed'
      },
      {
        id: '2',
        amount: 15,
        paidDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        helperName: 'John Smith',
        paymentMethod: 'bank',
        status: 'completed'
      }
    ];
    
    res.json(mockHistory);
  } catch (error) {
    console.error('Repayment history error:', error);
    res.status(500).json({ message: 'Failed to fetch repayment history' });
  }
});

app.post('/api/repayment/process/:repaymentId', (req, res) => {
  try {
    const { repaymentId } = req.params;
    res.json({ message: 'Repayment processed successfully' });
  } catch (error) {
    console.error('Process repayment error:', error);
    res.status(500).json({ message: 'Failed to process repayment' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Product reviews endpoint
app.get('/api/products/:id/reviews', (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      productId: id,
      reviews: product.customerReviews || [],
      averageRating: product.rating || 0,
      totalReviews: product.reviews || 0
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error getting reviews' });
  }
});

app.post('/api/products/:id/reviews', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add new review
    const newReview = {
      user: req.user.id,
      name: req.user.name,
      rating: parseInt(rating),
      comment,
      createdAt: new Date()
    };
    
    if (!product.customerReviews) {
      product.customerReviews = [];
    }
    product.customerReviews.push(newReview);
    
    // Update average rating
    const totalRating = product.customerReviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.customerReviews.length;
    product.reviews = product.customerReviews.length;
    
    res.json({
      message: 'Review added successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

// Search endpoint
app.get('/api/products/search', (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sortBy = 'name' } = req.query;
    let filteredProducts = [...mockProducts];

    // Text search
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Price filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({
      products: filteredProducts,
      total: filteredProducts.length,
      query: q,
      filters: { category, minPrice, maxPrice, sortBy }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

// Wishlist endpoints
app.get('/api/users/wishlist', auth, (req, res) => {
  try {
    // Mock wishlist data
    const wishlist = [
      mockProducts[0], // First product
      mockProducts[1]  // Second product
    ];
    
    res.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error getting wishlist' });
  }
});

app.post('/api/users/wishlist', auth, (req, res) => {
  try {
    const { productId } = req.body;
    // In a real app, add to user's wishlist in database
    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
});

app.delete('/api/users/wishlist/:productId', auth, (req, res) => {
  try {
    const { productId } = req.params;
    // In a real app, remove from user's wishlist in database
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
});

// Users endpoint for admin dashboard
app.get('/api/users', auth, (req, res) => {
  try {
    // Only admin can access users list
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    const { limit = 50, offset = 0, role } = req.query;
    let users = mockUsers;
    
    // Filter by role if specified
    if (role) {
      users = users.filter(u => u.role === role);
    }
    
    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    // Remove sensitive data
    const safeUsers = paginatedUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    res.json({
      users: safeUsers,
      total: users.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error getting users' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Mock data loaded: ${mockUsers.length} users (${mockUsers.filter(u => u.role === 'customer').length} customers, ${mockUsers.filter(u => u.role === 'vendor').length} vendors, ${mockUsers.filter(u => u.role === 'admin').length} admins), ${mockProducts.length} products, ${mockVendors.length} vendors`);
});

module.exports = app;

