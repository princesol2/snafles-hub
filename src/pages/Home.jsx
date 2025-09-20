import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Home = () => {
  console.log('Home component starting to render...')
  
  // Safe context usage with fallbacks
  let loading = false
  let error = null
  let user = null
  let addToCart = () => {}
  let isInCart = () => false
  let getFeaturedProducts = () => []
  let getNewArrivals = () => []
  let getBestSellers = () => []
  let getDeals = () => []
  
  try {
    const productsContext = useProducts()
    loading = productsContext?.loading || false
    error = productsContext?.error || null
    getFeaturedProducts = productsContext?.getFeaturedProducts || (() => [])
    getNewArrivals = productsContext?.getNewArrivals || (() => [])
    getBestSellers = productsContext?.getBestSellers || (() => [])
    getDeals = productsContext?.getDeals || (() => [])
  } catch (err) {
    console.log('Products context error:', err.message)
  }
  
  try {
    const cartContext = useCart()
    addToCart = cartContext?.addToCart || (() => {})
    isInCart = cartContext?.isInCart || (() => false)
  } catch (err) {
    console.log('Cart context error:', err.message)
  }
  
  try {
    const authContext = useAuth()
    user = authContext?.user || null
  } catch (err) {
    console.log('Auth context error:', err.message)
  }
  
  const [currentSlide, setCurrentSlide] = useState(0)

  console.log('Contexts loaded:', { loading, error, user })

  // Add loading and error handling
  if (loading) {
    console.log('Showing loading state...')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-xl">Loading SNAFLEShub...</p>
          <p className="mt-2 text-gray-500">Please wait while we load your marketplace</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.log('Showing error state:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4 text-xl">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    )
  }

  const featuredProducts = getFeaturedProducts()
  const newArrivals = getNewArrivals()
  const bestSellers = getBestSellers()
  const deals = getDeals()

  console.log('Home component rendering with:', { featuredProducts, newArrivals, bestSellers, deals })

  // Simple fallback if no products
  if (!featuredProducts || featuredProducts.length === 0) {
    console.log('No products found, showing fallback...')
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Welcome to SNAFLEShub</h1>
            <p className="text-xl mb-8">Your Global Marketplace for Handmade Treasures</p>
            <Link 
              to="/products" 
              className="bg-white text-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/products?category=Jewelry" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-semibold mb-2">Jewelry</h3>
                <p className="text-gray-600">Handcrafted jewelry pieces</p>
              </Link>
              <Link to="/products?category=Decor" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-4">🏺</div>
                <h3 className="text-xl font-semibold mb-2">Decor</h3>
                <p className="text-gray-600">Beautiful home decorations</p>
              </Link>
              <Link to="/products?category=Clothing" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-4">👗</div>
                <h3 className="text-xl font-semibold mb-2">Clothing</h3>
                <p className="text-gray-600">Cozy handmade clothing</p>
              </Link>
              <Link to="/products?category=Accessories" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-4">👜</div>
                <h3 className="text-xl font-semibold mb-2">Accessories</h3>
                <p className="text-gray-600">Stylish accessories</p>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-pink-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
            <p className="text-gray-600 mb-8">Discover unique handmade products from artisans worldwide</p>
            <Link 
              to="/products" 
              className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const heroSlides = [
    {
      id: 1,
      title: "New Arrivals",
      subtitle: "Discover the latest handmade treasures from artisans worldwide",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Shop Now",
      link: "/products?filter=new"
    },
    {
      id: 2,
      title: "Handmade Jewelry",
      subtitle: "Exquisite pieces crafted with love and attention to detail",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=600&fit=crop",
      cta: "Explore Collection",
      link: "/products?category=Jewelry"
    },
    {
      id: 3,
      title: "Home Decor",
      subtitle: "Transform your space with unique handmade decorations",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
      cta: "Shop Decor",
      link: "/products?category=Decor"
    }
  ]

  const categories = [
    {
      id: 1,
      name: "Local Products",
      description: "Handmade treasures from local artisans",
      icon: "🏠",
      link: "/products?type=local",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "International Products",
      description: "Unique items from around the world",
      icon: "🌍",
      link: "/products?type=international",
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      name: "Vendor Specials",
      description: "Exclusive deals from featured vendors",
      icon: "⭐",
      link: "/vendors",
      color: "from-purple-500 to-purple-600"
    }
  ]

  const ProductCard = ({ product, badge = null }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {badge && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {badge}
          </span>
        )}
        <button
          onClick={() => {
            if (isInCart(product.id)) {
              toast.success("Already in cart!")
            } else {
              addToCart(product, 1)
              toast.success("Added to cart!")
            }
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isInCart(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-pink-500">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{product.rating || 4.5}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex-1 border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-50 transition-colors text-center"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{heroSlides[currentSlide].title}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">{heroSlides[currentSlide].subtitle}</p>
            <Link
              to={heroSlides[currentSlide].link}
              className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              {heroSlides[currentSlide].cta}
            </Link>
          </div>
        </div>
        
        {/* Hero Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`h-48 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white">
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link to="/products?filter=featured" className="text-pink-500 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">Best Sellers</h2>
              <Link to="/products?filter=bestsellers" className="text-pink-500 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} badge="BESTSELLER" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <Link to="/products?filter=new" className="text-pink-500 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} badge="NEW" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deals & Offers */}
      {deals.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">Special Deals</h2>
              <Link to="/products?filter=deals" className="text-pink-500 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} badge="SALE" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vendor Spotlight */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Meet Our Artisans</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the talented creators behind our unique handmade products
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/vendors"
              className="bg-white text-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Vendors
            </Link>
            <Link
              to="/vendors"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-500 transition-colors"
            >
              Meet Vendors
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home