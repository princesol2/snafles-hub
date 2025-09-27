const mongoose = require('mongoose');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snafleshub');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  const users = [
    {
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
      loyaltyPoints: 1250,
      preferences: {
        newsletter: true,
        smsNotifications: false
      }
    },
    {
      name: 'Test User',
      email: 'testexample@gmail.com',
      password: 'test123',
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 Test Avenue',
        city: 'Test City',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      },
      loyaltyPoints: 0,
      preferences: {
        newsletter: false,
        smsNotifications: false
      }
    },
    {
      name: 'Vendor User',
      email: 'vendor@snafles.com',
      password: 'vendor123',
      role: 'vendor',
      phone: '+91 98765 43210',
      address: {
        street: '123 Artisan Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      loyaltyPoints: 0,
      preferences: {
        newsletter: false,
        smsNotifications: false
      }
    },
    {
      name: 'Admin User',
      email: 'admin@snafles.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 000-0000',
      address: {
        street: '789 Admin Street',
        city: 'Admin City',
        state: 'CA',
        zipCode: '90210',
        country: 'US'
      }
    }
  ];

  for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.name}`);
    } else {
      console.log(`User already exists: ${userData.name}`);
    }
  }
};

const seedVendors = async () => {
  const vendors = [
    {
      name: 'Artisan Crafts Co.',
      description: 'Handcrafted jewelry and home decor items made with love and attention to detail.',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      location: 'Mumbai, India',
      categories: ['Jewelry', 'Decor'],
      rating: 4.8,
      reviews: 156,
      contact: {
        email: 'contact@artisancrafts.com',
        phone: '+91 98765 43210',
        website: 'https://artisancrafts.com',
        socialMedia: {
          instagram: '@artisancrafts',
          facebook: 'ArtisanCraftsCo'
        }
      },
      isVerified: true
    },
    {
      name: 'Handmade Treasures',
      description: 'Unique handmade accessories and clothing items from local artisans.',
      logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop',
      location: 'Delhi, India',
      categories: ['Clothing', 'Accessories'],
      rating: 4.6,
      reviews: 89,
      contact: {
        email: 'hello@handmadetreasures.com',
        phone: '+91 87654 32109',
        website: 'https://handmadetreasures.com'
      },
      isVerified: true
    },
    {
      name: 'Creative Home Studio',
      description: 'Beautiful home decor and art pieces to make your space special.',
      logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
      location: 'Bangalore, India',
      categories: ['Decor', 'Art', 'Home'],
      rating: 4.9,
      reviews: 203,
      contact: {
        email: 'info@creativehomestudio.com',
        phone: '+91 76543 21098',
        website: 'https://creativehomestudio.com'
      },
      isVerified: true
    },
    {
      name: 'Bani Makeover',
      description: 'Curated accessories and artistic pieces crafted to elevate your style and space.',
      logo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1515387784663-e2edd2dc3f0b?w=1200&h=400&fit=crop',
      location: 'Pune, India',
      categories: ['Accessories', 'Art'],
      rating: 4.7,
      reviews: 0,
      contact: {
        email: 'hello@banimakeover.com',
        phone: '+91 90000 12345',
        website: 'https://banimakeover.example.com',
        socialMedia: {
          instagram: '@banimakeover'
        }
      },
      isVerified: true
    },
    {
      name: 'Baani Makeovers',
      description: 'Professional bridal and party makeup with a focus on natural, long-lasting looks.',
      logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop',
      location: 'Gurugram, India',
      categories: ['Accessories', 'Art'],
      rating: 4.9,
      reviews: 312,
      contact: {
        email: 'hello@baanimakeovers.in',
        phone: '+91 98765 43210',
        website: 'https://baanimakeovers.in',
        socialMedia: {
          instagram: '@baanimakeovers'
        }
      },
      isVerified: true
    }
  ];

  for (const vendorData of vendors) {
    const existingVendor = await Vendor.findOne({ name: vendorData.name });
    if (!existingVendor) {
      const vendor = new Vendor(vendorData);
      await vendor.save();
      console.log(`Created vendor: ${vendorData.name}`);
    } else {
      console.log(`Vendor already exists: ${vendorData.name}`);
    }
  }
};

const seedProducts = async () => {
  const vendors = await Vendor.find();
  if (vendors.length === 0) {
    console.log('No vendors found. Please seed vendors first.');
    return;
  }
  const baniVendor = vendors.find(v => v.name === 'Bani Makeover');

  const products = [
    {
      name: 'Handcrafted Silver Necklace',
      description: 'Beautiful handcrafted silver necklace with intricate design patterns.',
      detailedDescription: 'This stunning silver necklace is handcrafted by skilled artisans using traditional techniques. The intricate design patterns are inspired by ancient Indian motifs, making it a perfect piece for special occasions or everyday wear.',
      price: 2999,
      originalPrice: 3999,
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop'
      ],
      category: 'Jewelry',
      vendor: vendors[0]._id,
      stock: 25,
      rating: 4.7,
      reviews: 45,
      featured: true,
      tags: ['silver', 'handcrafted', 'necklace', 'traditional'],
      specifications: {
        'Material': 'Sterling Silver',
        'Weight': '15g',
        'Length': '18 inches',
        'Clasp': 'Lobster Clasp',
        'Care': 'Store in dry place, clean with soft cloth'
      }
    },
    {
      name: 'Ceramic Vase Set',
      description: 'Set of 3 beautiful ceramic vases in different sizes.',
      detailedDescription: 'This elegant set includes three hand-thrown ceramic vases in varying heights. Each piece is unique with subtle variations in glaze and form, making them perfect for displaying flowers or as standalone decorative pieces.',
      price: 2499,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      category: 'Decor',
      vendor: vendors[2]._id,
      stock: 15,
      rating: 4.5,
      reviews: 32,
      featured: true,
      tags: ['ceramic', 'vase', 'handmade', 'decor'],
      variants: [
        { name: 'Small', price: 1999, stock: 10 },
        { name: 'Medium', price: 2499, stock: 8 },
        { name: 'Large', price: 2999, stock: 5 }
      ]
    },
    {
      name: 'Handwoven Cotton Scarf',
      description: 'Soft and comfortable handwoven cotton scarf with traditional patterns.',
      detailedDescription: 'This beautiful scarf is handwoven using 100% organic cotton. The traditional patterns are created using natural dyes, making each piece unique. Perfect for adding a touch of elegance to any outfit.',
      price: 1299,
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
      ],
      category: 'Clothing',
      vendor: vendors[1]._id,
      stock: 30,
      rating: 4.6,
      reviews: 28,
      featured: false,
      tags: ['cotton', 'handwoven', 'scarf', 'organic']
    },
    {
      name: 'Wooden Wall Art',
      description: 'Intricately carved wooden wall art featuring nature motifs.',
      detailedDescription: 'This stunning wall art is carved from reclaimed teak wood by master craftsmen. The nature-inspired motifs bring a sense of tranquility to any space. Each piece is unique due to the natural variations in wood grain.',
      price: 4599,
      originalPrice: 5999,
      images: [
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop'
      ],
      category: 'Art',
      vendor: vendors[2]._id,
      stock: 8,
      rating: 4.9,
      reviews: 15,
      featured: true,
      tags: ['wood', 'carved', 'wall art', 'nature'],
      specifications: {
        'Material': 'Reclaimed Teak Wood',
        'Dimensions': '24" x 18" x 2"',
        'Weight': '2.5 kg',
        'Finish': 'Natural Wood Oil',
        'Care': 'Dust regularly, avoid direct sunlight'
      }
    },
    {
      name: 'Leather Handbag',
      description: 'Handcrafted leather handbag with traditional embroidery.',
      detailedDescription: 'This elegant handbag is made from premium quality leather and features traditional embroidery work. The spacious interior and sturdy construction make it perfect for daily use while maintaining a sophisticated look.',
      price: 3599,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
      ],
      category: 'Accessories',
      vendor: vendors[1]._id,
      stock: 20,
      rating: 4.4,
      reviews: 67,
      featured: false,
      tags: ['leather', 'handbag', 'embroidery', 'handcrafted']
    },
    // Bani Makeover products (Accessories/Art)
    {
      name: 'Floral Hair Accessory Set',
      description: 'Handcrafted floral hair clips set for special occasions.',
      detailedDescription: 'A curated set of three handcrafted floral hair clips made with premium materials. Perfect for bridal looks and festive outfits.',
      price: 1499,
      images: [
        'https://images.unsplash.com/photo-1512203492609-8f8e1b5b8d1e?w=800&h=600&fit=crop'
      ],
      category: 'Accessories',
      vendor: (baniVendor && baniVendor._id) || vendors[0]._id,
      stock: 40,
      rating: 4.6,
      reviews: 12,
      featured: true,
      tags: ['floral', 'hair', 'accessory', 'handcrafted']
    },
    {
      name: 'Minimalist Wall Art Print',
      description: 'Premium matte art print to refresh your interiors.',
      detailedDescription: 'A minimalist art print on premium matte paper. Adds an elegant touch to living rooms and studios alike.',
      price: 999,
      images: [
        'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&h=600&fit=crop'
      ],
      category: 'Art',
      vendor: (baniVendor && baniVendor._id) || vendors[0]._id,
      stock: 60,
      rating: 4.5,
      reviews: 8,
      featured: false,
      tags: ['art', 'print', 'minimalist']
    }
  ];

  for (const productData of products) {
    const existingProduct = await Product.findOne({ name: productData.name });
    if (!existingProduct) {
      const product = new Product(productData);
      await product.save();
      console.log(`Created product: ${productData.name}`);
    } else {
      console.log(`Product already exists: ${productData.name}`);
    }
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedVendors();
    await seedProducts();
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
