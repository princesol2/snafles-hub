// Lightweight demo data for development fallback

export const demoVendors = [
  {
    id: 'v1',
    name: 'Artisan Crafts Co.',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
    location: 'Mumbai, India',
    rating: 4.8,
  },
  {
    id: 'v2',
    name: 'Handmade Treasures',
    logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop',
    location: 'Delhi, India',
    rating: 4.6,
  },
  {
    id: 'v3',
    name: 'Creative Home Studio',
    logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
    location: 'Bangalore, India',
    rating: 4.9,
  },
]

export const demoProducts = [
  {
    id: 'p1',
    name: 'Handcrafted Silver Necklace',
    description: 'Beautiful handcrafted silver necklace with intricate designs.',
    detailedDescription: 'Handmade sterling silver necklace inspired by traditional motifs.',
    price: 2999,
    originalPrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&h=600&fit=crop'
    ],
    category: 'Jewelry',
    vendor: { id: 'v1', name: 'Artisan Crafts Co.', logo: demoVendors[0].logo },
    stock: 25,
    rating: 4.7,
    reviews: 45,
    featured: true,
  },
  {
    id: 'p2',
    name: 'Ceramic Vase Set',
    description: 'Set of 3 beautiful ceramic vases in different sizes.',
    price: 2499,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    category: 'Decor',
    vendor: { id: 'v3', name: 'Creative Home Studio', logo: demoVendors[2].logo },
    stock: 15,
    rating: 4.5,
    reviews: 32,
    featured: true,
  },
  {
    id: 'p3',
    name: 'Handwoven Cotton Scarf',
    description: 'Soft cotton scarf with traditional patterns.',
    price: 1299,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520975922329-7f6db86d5111?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1508020963102-c6c723be5765?w=800&h=600&fit=crop'
    ],
    category: 'Clothing',
    vendor: { id: 'v2', name: 'Handmade Treasures', logo: demoVendors[1].logo },
    stock: 30,
    rating: 4.6,
    reviews: 28,
    featured: false,
    variants: [
      { name: 'Size S', price: 1299, stock: 10 },
      { name: 'Size M', price: 1299, stock: 12 },
      { name: 'Size L', price: 1299, stock: 8 }
    ],
  },
  {
    id: 'p4',
    name: 'Wooden Wall Art',
    description: 'Intricately carved wooden wall art.',
    price: 4599,
    originalPrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop'
    ],
    category: 'Art',
    vendor: { id: 'v3', name: 'Creative Home Studio', logo: demoVendors[2].logo },
    stock: 8,
    rating: 4.9,
    reviews: 15,
    featured: true,
  },
  {
    id: 'p5',
    name: 'Leather Handbag',
    description: 'Handcrafted leather handbag with embroidery.',
    price: 3599,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
    ],
    category: 'Accessories',
    vendor: { id: 'v2', name: 'Handmade Treasures', logo: demoVendors[1].logo },
    stock: 20,
    rating: 4.4,
    reviews: 67,
    featured: false,
  },
  {
    id: 'p6',
    name: 'Minimalist Wall Art Print',
    description: 'Premium matte art print for interiors.',
    price: 999,
    images: [
      'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&h=600&fit=crop'
    ],
    category: 'Art',
    vendor: { id: 'v1', name: 'Artisan Crafts Co.', logo: demoVendors[0].logo },
    stock: 60,
    rating: 4.5,
    reviews: 8,
    featured: false,
  },
  {
    id: 'p7',
    name: 'Snafles Demo Mug',
    description: 'Matte ceramic mug with SNAFLEShub branding.',
    detailedDescription: 'A premium matte-finish ceramic mug featuring the SNAFLEShub logo. Perfect for your workspace and daily coffee.',
    price: 699,
    originalPrice: 899,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop'
    ],
    category: 'Decor',
    vendor: { id: 'v3', name: 'Creative Home Studio', logo: demoVendors[2].logo },
    stock: 50,
    rating: 4.9,
    reviews: 5,
    featured: true,
  },
]
