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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
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
  console.log(`📊 Mock data loaded: ${mockUsers.length} users, ${mockProducts.length} products, ${mockVendors.length} vendors`);
});

module.exports = app;

