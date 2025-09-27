import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { api } from '../services/api'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const { addToCart, isInCart } = useCart()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users/wishlist')
        setWishlist(res.data?.wishlist || [])
      } catch (e) {
        // Fallback to localStorage if API fails
        const saved = JSON.parse(localStorage.getItem('snaflesWishlist') || '[]')
        setWishlist(saved)
      }
    }
    load()
  }, [])

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`)
    } catch (e) {
      // ignore
    }
    const updatedWishlist = wishlist.filter(item => (item.id || item._id) !== productId)
    setWishlist(updatedWishlist)
    localStorage.setItem('snaflesWishlist', JSON.stringify(updatedWishlist))
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (product) => {
    try {
      // Ensure product has the correct ID format
      const productWithId = {
        ...product,
        id: product.id || product._id
      }
      addToCart(productWithId)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const ProductCard = ({ product }) => {
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0

    return (
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <Link to={`/product/${product.id || product._id}`}>
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
            <button
              onClick={(e) => {
                e.preventDefault()
                removeFromWishlist(product.id || product._id)
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </Link>
        <div className="p-4">
          <Link to={`/product/${product.id || product._id}`}>
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
              disabled={isInCart(product.id || product._id)}
              className={`p-2 rounded-lg transition-colors ${
                isInCart(product.id || product._id)
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

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-16">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <Heart size={64} className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8">Save items you love to your wishlist and they'll appear here.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
