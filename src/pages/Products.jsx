import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import toast from 'react-hot-toast'

const Products = () => {
  const { products, loading, searchProducts } = useProducts()
  const { addToCart, isInCart } = useCart()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [wishlisted, setWishlisted] = useState(new Set())

  const searchQuery = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''
  const filterType = searchParams.get('filter') || ''

  useEffect(() => {
    // Load wishlist ids from backend to toggle heart state
    (async () => {
      try {
        const res = await api.get('/users/wishlist')
        const ids = new Set((res.data?.wishlist || []).map((p) => p.id || p._id))
        setWishlisted(ids)
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  useEffect(() => {
    let filtered = products

    // Apply search filter
    if (searchQuery) {
      filtered = searchProducts(searchQuery)
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    // Apply special filters
    if (filterType) {
      switch (filterType) {
        case 'new':
          filtered = filtered.slice(-8)
          break
        case 'featured':
          filtered = filtered.filter(product => product.featured)
          break
        case 'bestsellers':
          filtered = filtered.filter(product => product.rating >= 4.5)
          break
        case 'deals':
          filtered = filtered.filter(product => product.originalPrice)
          break
        default:
          break
      }
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Apply category filter from state
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, categoryFilter, filterType, priceRange, selectedCategory, sortBy, searchProducts])

  const categories = ['all', 'Jewelry', 'Decor', 'Clothing', 'Accessories']

  const handleAddToCart = (product) => {
    if (!user) {
      toast('Please sign in to add items to your cart', {
        icon: '🔐',
        duration: 3000,
      })
      return
    }
    
    addToCart(product)
    toast.success('Added to cart!')
  }

  const ProductCard = ({ product }) => {
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0

    const placeholderImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'

    const addToWishlist = async () => {
      try {
        await api.post('/users/wishlist', { productId: product.id })
        setWishlisted((prev) => new Set([...Array.from(prev), product.id]))
        toast.success('Added to wishlist')
      } catch (e) {
        toast.error(e?.message || 'Failed to add to wishlist')
      }
    }

    return (
      <div className="group card-premium hover-lift overflow-hidden">
        <div className="relative">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image || product.images?.[0] || placeholderImage}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              -{discount}%
            </div>
          )}
          <button
            aria-label="Add to wishlist"
            onClick={(e) => { e.preventDefault(); addToWishlist(); }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 ${
              wishlisted.has(product.id) ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm'
            }`}
            title={wishlisted.has(product.id) ? 'In wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} className={wishlisted.has(product.id) ? 'text-white' : 'text-gray-600'} />
          </button>
        </div>
        <div className="p-6">
          <Link to={`/product/${product.id}`}>
            <h3 className="heading-4 mb-3 line-clamp-2 hover:text-navy-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center mb-3">
            <div className="flex text-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">({product.reviews || 0})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-navy-600">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={isInCart(product.id)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isInCart(product.id)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn btn-primary hover:scale-110'
              }`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ProductListItem = ({ product }) => {
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0

    const placeholderImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'

    return (
      <div className="card-premium hover-lift p-6">
        <div className="flex gap-6">
          <Link to={`/product/${product.id}`} className="flex-shrink-0">
            <img
              src={product.image || product.images?.[0] || placeholderImage}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-xl"
            />
          </Link>
          <div className="flex-1">
            <Link to={`/product/${product.id}`}>
              <h3 className="heading-4 mb-3 hover:text-navy-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-center mb-4">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.reviews || 0} reviews)</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-navy-600">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span className="ml-2 text-red-500 font-semibold">-{discount}% OFF</span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={isInCart(product.id)}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  isInCart(product.id)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn btn-primary'
                }`}
              >
                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 text-lg font-semibold">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-gray-100">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-2 mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             categoryFilter ? `${categoryFilter} Products` :
             filterType ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Products` :
             'All Products'}
          </h1>
          <p className="text-gray-700 text-lg">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setPriceRange([0, 10000])
                    setSearchParams({})
                  }}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-6'
              }>
                {filteredProducts.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
