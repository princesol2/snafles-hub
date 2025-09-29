import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Home = () => {
  const { products, loading } = useProducts()
  const { addToCart, isInCart } = useCart()
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentFeaturedSlide, setCurrentFeaturedSlide] = useState(0)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Wishlist functionality using localStorage
  const addToWishlist = (productId) => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('snaflesWishlist') || '[]')
      if (!savedWishlist.includes(productId)) {
        savedWishlist.push(productId)
        localStorage.setItem('snaflesWishlist', JSON.stringify(savedWishlist))
        toast.success('Added to wishlist!')
      } else {
        toast.success('Already in wishlist!')
      }
    } catch (error) {
      toast.error('Failed to add to wishlist')
    }
  }

  // Define static data first to avoid temporal dead zone issues
  const categories = [
    {
      id: 1,
      name: "Jewelry",
      description: "Handcrafted jewelry and accessories",
      icon: "💎",
      link: "/products?category=Jewelry",
      color: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Clothing",
      description: "Unique handmade clothing",
      icon: "👗",
      link: "/products?category=Clothing",
      color: "from-orange-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Home Decor",
      description: "Beautiful home decoration items",
      icon: "🏠",
      link: "/products?category=Home & Garden",
      color: "from-pink-500 to-pink-600",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Beauty",
      description: "Natural beauty and cosmetics",
      icon: "💄",
      link: "/products?category=Beauty & Cosmetics",
      color: "from-blue-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      name: "Electronics",
      description: "Tech gadgets and accessories",
      icon: "📱",
      link: "/products?category=Electronics",
      color: "from-orange-500 to-blue-500",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
      id: 6,
      name: "Sports",
      description: "Sports and fitness equipment",
      icon: "⚽",
      link: "/products?category=Sports & Fitness",
      color: "from-pink-500 to-orange-500",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop"
    }
  ]

  const heroSlides = [
    {
      id: 1,
      title: "Discover Unique Handmade Products",
      subtitle: "Shop from talented artisans worldwide and find one-of-a-kind items",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      link: "/products",
      buttonText: "Shop Now"
    },
    {
      id: 2,
      title: "Support Local Artisans",
      subtitle: "Every purchase helps support independent creators and their craft",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      link: "/vendors",
      buttonText: "Meet Vendors"
    },
    {
      id: 3,
      title: "Quality You Can Trust",
      subtitle: "Handpicked products with premium quality and authentic craftsmanship",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
      link: "/products?featured=true",
      buttonText: "Featured Items"
    }
  ]

  // Filter products for different sections
  const featuredProducts = products?.filter(product => product.featured === true) || []
  
  // Get products to display in slider based on filter state
  const displayProducts = showFeaturedOnly ? featuredProducts : products || []
  
  // Debug: Check if products are loaded
  console.log('Home - Products:', products?.length, 'Featured:', featuredProducts?.length, 'Display:', displayProducts?.length, 'Loading:', loading)
  const newArrivals = products?.filter(product => {
    const createdAt = new Date(product.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdAt > weekAgo
  }) || []
  const bestSellers = products?.filter(product => product.rating >= 4.5) || []
  const deals = products?.filter(product => product.originalPrice && product.originalPrice > product.price) || []

  // Auto-slide functionality for hero
  useEffect(() => {
    if (heroSlides && heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
      }, 5000) // Change slide every 5 seconds

      return () => clearInterval(interval)
    }
  }, [heroSlides])

  // Auto-slide functionality for featured products
  useEffect(() => {
    if (displayProducts && displayProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeaturedSlide((prev) => (prev === Math.ceil(displayProducts.length / 4) - 1 ? 0 : prev + 1))
      }, 4000) // Change slide every 4 seconds

      return () => clearInterval(interval)
    }
  }, [displayProducts])

  const ProductCard = ({ product, badge = null }) => (
    <div className="card-premium hover-lift overflow-hidden group">
      <div className="relative">
        <img
          src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {badge}
          </span>
        )}
        <button
          onClick={() => addToWishlist(product.id)}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Heart size={16} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
            <span className="text-sm text-gray-400">({product.reviews || 0})</span>
          </div>
          <span className="text-sm text-gray-500">${product.price}</span>
        </div>
        <button
          onClick={() => addToCart(product.id)}
          className="w-full btn btn-primary text-sm py-2 flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      {/* Hero Section */}
      {heroSlides && heroSlides.length > 0 && (
        <section className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroSlides[currentSlide]?.image}
              alt={heroSlides[currentSlide]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {heroSlides[currentSlide]?.title}
                </h1>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  {heroSlides[currentSlide]?.subtitle}
                </p>
                <Link
                  to={heroSlides[currentSlide]?.link || "/products"}
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  {heroSlides[currentSlide]?.buttonText || "Shop Now"}
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide(prev => prev === 0 ? heroSlides.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => prev === heroSlides.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <h2 className="heading-2 text-center mb-16">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="card-feature hover-lift group"
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`}></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  </div>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              {showFeaturedOnly ? 'Featured Products' : 'All Products'}
            </h2>
            <p className="text-gray-600 text-lg">
              {showFeaturedOnly ? 'Handpicked items from our best sellers' : 'Browse our complete collection'}
            </p>
            
            {/* Featured Products Filter Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  showFeaturedOnly
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                }`}
              >
                {showFeaturedOnly ? 'Show All Products' : 'Show Featured Only'}
              </button>
              {showFeaturedOnly && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing {featuredProducts.length} featured products
                </p>
              )}
            </div>
          </div>
          
          {displayProducts && displayProducts.length > 0 ? (
            <div className="relative">
              {/* Slider Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentFeaturedSlide * 100}%)`,
                    width: `${Math.ceil(displayProducts.length / 4) * 100}%`
                  }}
                >
                  {Array.from({ length: Math.ceil(displayProducts.length / 4) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayProducts
                          .slice(slideIndex * 4, (slideIndex + 1) * 4)
                          .map((product) => (
                            <ProductCard 
                              key={product.id} 
                              product={product} 
                              badge={product.featured ? "Featured" : null} 
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {displayProducts.length > 4 && (
                <>
                  <button
                    onClick={() => setCurrentFeaturedSlide(prev => 
                      prev === 0 ? Math.ceil(displayProducts.length / 4) - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setCurrentFeaturedSlide(prev => 
                      prev === Math.ceil(displayProducts.length / 4) - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {displayProducts.length > 4 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.ceil(displayProducts.length / 4) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeaturedSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentFeaturedSlide 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to={showFeaturedOnly ? "/products?featured=true" : "/products"} 
              className="btn btn-outline"
            >
              {showFeaturedOnly ? "View All Featured Products" : "View All Products"}
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">New Arrivals</h2>
            <p className="text-gray-600 text-lg">Fresh products added this week</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} badge="New" />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products?sort=newest" className="btn btn-outline">
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-gradient-to-br from-orange-50/30 to-pink-50/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Best Sellers</h2>
            <p className="text-gray-600 text-lg">Customer favorites and top-rated items</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} badge="Best Seller" />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products?sort=popular" className="btn btn-outline">
              View All Best Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Featured Vendors</h2>
            <p className="text-gray-600 text-lg">Meet our top-rated artisans and creators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tanmay Arora */}
            <div className="card-feature hover-lift group">
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
                  alt="Tanmay Arora"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ 4.9
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tanmay Arora</h3>
                <p className="text-gray-600 mb-3">Jewelry & Accessories Specialist</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">📍 New Delhi, India</span>
                  <span className="text-sm text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>🎨 150+ Products</span>
                  <span>👥 2.5k+ Customers</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Master craftsman specializing in traditional Indian jewelry with a modern twist. 
                  Known for intricate designs and premium quality materials.
                </p>
                <Link
                  to="/vendor/tanmay-arora"
                  className="btn btn-outline w-full"
                >
                  Visit Store
                </Link>
              </div>
            </div>

            {/* Bani Makeovers */}
            <div className="card-feature hover-lift group">
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop"
                  alt="Bani Makeovers"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ 4.8
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bani Makeovers</h3>
                <p className="text-gray-600 mb-3">Beauty & Cosmetics Expert</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">📍 Mumbai, India</span>
                  <span className="text-sm text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>💄 200+ Products</span>
                  <span>👥 3.2k+ Customers</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Professional makeup artist and beauty consultant offering premium cosmetics 
                  and personalized beauty solutions for all skin types.
                </p>
                <Link
                  to="/vendor/bani-makeovers"
                  className="btn btn-outline w-full"
                >
                  Visit Store
                </Link>
              </div>
            </div>

            {/* Top Seller of the Month */}
            <div className="card-feature hover-lift group">
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop"
                  alt="Alex Chen"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    🏆 Top Seller
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Alex Chen</h3>
                <p className="text-gray-600 mb-3">Home Decor & Crafts</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">📍 San Francisco, USA</span>
                  <span className="text-sm text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>🏠 180+ Products</span>
                  <span>👥 4.1k+ Customers</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  This month's top seller! Specializing in minimalist home decor and 
                  sustainable crafts. Known for eco-friendly materials and modern designs.
                </p>
                <Link
                  to="/vendor/alex-chen"
                  className="btn btn-outline w-full"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/vendors" className="btn btn-outline">
              View All Vendors
            </Link>
          </div>
        </div>
      </section>

      {/* Top Sellers of the Week */}
      <section className="py-20 bg-gradient-to-br from-purple-50/30 to-blue-50/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Top Sellers This Week</h2>
            <p className="text-gray-600 text-lg">The most popular products this week</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers?.slice(0, 4).map((product, index) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} badge={`#${index + 1} This Week`} />
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    🔥 HOT
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products?sort=trending" className="btn btn-outline">
              View Weekly Trends
            </Link>
          </div>
        </div>
      </section>

      {/* Special Deals */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Special Deals</h2>
            <p className="text-gray-600 text-lg">Limited time offers you don't want to miss</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals?.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} badge="Sale" />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products?sort=discount" className="btn btn-outline">
              View All Deals
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="gradient-soft py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-2 mb-6">Ready to Start Shopping?</h2>
          <p className="text-gray-700 mb-10 text-lg">Discover unique handmade products from artisans worldwide</p>
          <Link 
            to="/products" 
            className="btn btn-primary"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home