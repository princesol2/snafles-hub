import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, MessageSquare, Users } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import NegotiationButton from '../components/NegotiationButton'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById } = useProducts()
  const { addToCart, isInCart, getCartItem } = useCart()
  const { user } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const productData = getProductById(id)
    if (productData) {
      setProduct(productData)
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0])
      }
    } else {
      navigate('/products')
    }
    setLoading(false)
  }, [id, getProductById, navigate])

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    const productToAdd = {
      ...product,
      selectedVariant: selectedVariant
    }
    
    addToCart(productToAdd, quantity)
    toast.success('Added to cart!')
  }

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to continue')
      navigate('/login')
      return
    }

    handleAddToCart()
    navigate('/checkout')
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const images = product.images || [product.image]
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0

  const cartItem = getCartItem(product.id)
  const isInCartCheck = isInCart(product.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/reviews/product/${product.id}`)}
                    className="text-sm text-primary hover:text-primary/80 ml-2 font-medium"
                  >
                    ({product.reviews || 0} reviews)
                  </button>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Options</h3>
                <div className="space-y-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedVariant?.name === variant.name
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{variant.name}</span>
                        <span className="text-primary font-semibold">₹{variant.price.toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  {product.stock || 99} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCartCheck}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isInCartCheck
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {isInCartCheck ? 'In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-6 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
                >
                  Buy Now
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
              
              {/* Negotiation Button */}
              <NegotiationButton 
                product={product} 
                vendor={{
                  id: product?.vendor?.id || 1,
                  name: product?.vendor?.name || 'Artisan Crafts Co.'
                }}
              />
            </div>

            {/* Vendor Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {product?.vendor?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {product?.vendor?.name || 'Artisan Crafts Co.'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={4.8} size="sm" />
                      <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/vendor/${product?.vendor?.id || 1}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => navigate(`/reviews/vendor/${product?.vendor?.id || 1}`)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="text-primary" size={20} />
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-500">On orders over ₹999</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="text-primary" size={20} />
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-500">100% protected</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="text-primary" size={20} />
                <div>
                  <div className="font-semibold text-sm">Easy Returns</div>
                  <div className="text-xs text-gray-500">30-day return</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-1 border-b-2 border-primary text-primary font-semibold">
                  Description
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  Specifications
                </button>
                <button 
                  onClick={() => navigate(`/reviews/product/${product.id}`)}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Reviews ({product.reviews || 0})</span>
                </button>
              </nav>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.detailedDescription || product.description}
                </p>
                
                {product.specifications && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.customerReviews && product.customerReviews.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Customer Reviews</h4>
                    <div className="space-y-4">
                      {product.customerReviews.slice(0, 3).map((review, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">{review.name}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
