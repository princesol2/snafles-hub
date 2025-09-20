import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Calendar, ShoppingCart, Heart } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const VendorShop = () => {
  const { id } = useParams()
  const { getVendorById, getProductsByVendor } = useProducts()
  const { addToCart, isInCart } = useCart()
  const [sortBy, setSortBy] = useState('name')

  const vendor = getVendorById(id)
  const products = getProductsByVendor(id)

  if (!vendor) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor not found</h1>
          <Link to="/vendors" className="btn btn-primary">Back to Vendors</Link>
        </div>
      </div>
    )
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success('Added to cart!')
  }

  const ProductCard = ({ product }) => {
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0

    return (
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{discount}%
              </div>
            )}
            <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart size={16} className="text-gray-600" />
            </button>
          </div>
        </Link>
        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviews || 0})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={isInCart(product.id)}
              className={`p-2 rounded-lg transition-colors ${
                isInCart(product.id)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Vendor Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={vendor.logo}
              alt={`${vendor.name} logo`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.name}</h1>
              <p className="text-gray-600 mb-4">{vendor.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Joined {new Date(vendor.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(vendor.rating || 4) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="ml-2">({vendor.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              Products ({products.length})
            </h2>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">This vendor hasn't added any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VendorShop
