import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, MessageSquare, Users, Zap, HelpingHand, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { productsAPI } from '../services/api'
import StarRating from '../components/reviews/StarRating'
import NegotiationButton from '../components/NegotiationButton'
import RealTimeChat from '../components/chat/RealTimeChat'
import LiveBidding from '../components/bidding/LiveBidding'
import PeerAssistance from '../components/assistance/PeerAssistance'
import HelperPoints from '../components/rewards/HelperPoints'
import VirtualTryOn from '../components/tryon/VirtualTryOn'
import LoginModal from '../components/common/LoginModal'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById } = useProducts()
  const { addToCart, isInCart, getCartItem } = useCart()
  const { user } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAutoSliding, setIsAutoSliding] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // New feature states
  const [showChat, setShowChat] = useState(false)
  const [showBidding, setShowBidding] = useState(false)
  const [showAssistance, setShowAssistance] = useState(false)
  const [showHelperPoints, setShowHelperPoints] = useState(false)
  const [showTryOn, setShowTryOn] = useState(false)
  
  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginRedirectTo, setLoginRedirectTo] = useState('/')
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      try {
        console.log('Loading product with ID:', id)
        
        // Try from context first
        const productData = getProductById(id)
        if (productData) {
          console.log('Product found in context:', productData)
          if (!isMounted) return
          setProduct(productData)
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0])
          }
          return
        }
        
        // Fallback: fetch from API
        console.log('Product not in context, fetching from API...')
        const data = await productsAPI.getProduct(id)
        console.log('Product data from API:', data)
        
        const normalized = {
          ...data,
          id: data.id || data._id,
          image: data.image || (Array.isArray(data.images) ? data.images[0] : undefined),
          vendor: typeof data.vendor === 'object' && data.vendor !== null
            ? { ...data.vendor, id: data.vendor.id || data.vendor._id }
            : data.vendor
        }
        
        if (!isMounted) return
        setProduct(normalized)
        if (normalized.variants && normalized.variants.length > 0) {
          setSelectedVariant(normalized.variants[0])
        }
      } catch (e) {
        console.error('Error loading product:', e)
        if (!isMounted) return
        toast.error('Product not found')
        navigate('/products')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    if (id) {
      load()
    } else {
      console.error('No product ID provided')
      navigate('/products')
    }
    
    return () => { isMounted = false }
  }, [id, getProductById, navigate])

  // Auto-slide images
  useEffect(() => {
    if (!product || !isAutoSliding) return
    
    const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : [])
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [product, isAutoSliding])

  const handleAddToCart = () => {
    if (!user) {
      setLoginRedirectTo('/cart')
      setShowLoginModal(true)
      toast('Please sign in to add items to your cart', {
        icon: '🔐',
        duration: 3000,
      })
      return
    }

    try {
      const productToAdd = {
        ...product,
        selectedVariant: selectedVariant,
        selectedSize: selectedSize,
        selectedColor: selectedColor
      }
      
      addToCart(productToAdd, quantity)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleLoginPrompt = (action, redirectTo = '/') => {
    if (!user) {
      setLoginRedirectTo(redirectTo)
      setShowLoginModal(true)
      toast(`Please sign in to ${action}`, {
        icon: '🔐',
        duration: 3000,
      })
      return false
    }
    return true
  }

  const handleBuyNow = () => {
    if (!user) {
      setLoginRedirectTo('/checkout')
      setShowLoginModal(true)
      toast('Please sign in to continue with your purchase', {
        icon: '🔐',
        duration: 3000,
      })
      return
    }

    // Go directly to checkout without adding to cart
    // The checkout page will handle the product details
    navigate('/checkout', { 
      state: { 
        product: {
          ...product,
          selectedVariant: selectedVariant,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
          quantity: quantity
        }
      } 
    })
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to write a review')
      return
    }

    setSubmittingReview(true)
    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment
        })
      })

      if (response.ok) {
        toast.success('Review submitted successfully!')
        setReviewRating(0)
        setReviewComment('')
        // Reload product to show new review
        const updatedProduct = await productsAPI.getProductById(product.id)
        setProduct(updatedProduct)
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
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

  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : ['/placeholder-product.jpg'])
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
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm group">
              <img
                src={images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg'
                }}
              />
              
              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
                      setIsAutoSliding(false)
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
                      setIsAutoSliding(false)
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              
              {/* Auto-slide toggle */}
              {images.length > 1 && (
                <button
                  onClick={() => setIsAutoSliding(!isAutoSliding)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300"
                  title={isAutoSliding ? 'Pause slideshow' : 'Start slideshow'}
                >
                  {isAutoSliding ? (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-1 h-3 bg-gray-700 mr-1"></div>
                      <div className="w-1 h-3 bg-gray-700"></div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[6px] border-l-gray-700 border-y-[4px] border-y-transparent"></div>
                    </div>
                  )}
                </button>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index)
                      setIsAutoSliding(false)
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImage === index ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg'
                      }}
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
              <span className="text-3xl font-bold text-primary">₹{(product.price || 0).toLocaleString()}</span>
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
                <h3 className="font-semibold text-gray-900 mb-3">{product.category === 'Clothing' ? 'Select Size' : 'Options'}</h3>
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

            {/* Size Selection for Clothing */}
            {product.category === 'Clothing' && product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeOption) => (
                    <button
                      key={sizeOption.size}
                      onClick={() => setSelectedSize(sizeOption)}
                      disabled={sizeOption.stock === 0}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedSize?.size === sizeOption.size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : sizeOption.stock === 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {sizeOption.size}
                      {sizeOption.stock === 0 && (
                        <span className="block text-xs text-red-500">Out of Stock</span>
                      )}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-sm text-orange-600 mt-2">Please select a size</p>
                )}
              </div>
            )}

            {/* Color Selection for Clothing */}
            {product.category === 'Clothing' && product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => setSelectedColor(colorOption)}
                      disabled={colorOption.stock === 0}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        selectedColor?.name === colorOption.name
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : colorOption.stock === 0
                          ? 'border-gray-300 opacity-50 cursor-not-allowed'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                      style={{ backgroundColor: colorOption.hex }}
                      title={`${colorOption.name} (${colorOption.stock} available)`}
                    >
                      {colorOption.stock === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-red-500 font-bold">×</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedColor.name} ({selectedColor.stock} available)
                  </p>
                )}
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
                  {selectedSize ? (selectedSize.stock || 0) : (product.stock || 99)} available
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
              
              {/* New Feature Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleLoginPrompt('chat with vendor') || setShowChat(true)}
                  className="btn btn-primary flex items-center justify-center space-x-2 hover-lift"
                >
                  <MessageSquare size={18} />
                  <span>Chat & Negotiate</span>
                </button>
                
                <button
                  onClick={() => handleLoginPrompt('participate in live bidding') || setShowBidding(true)}
                  className="btn btn-pink flex items-center justify-center space-x-2 hover-lift"
                >
                  <Zap size={18} />
                  <span>Live Bidding</span>
                </button>
                
                <button
                  onClick={() => handleLoginPrompt('request peer assistance') || setShowAssistance(true)}
                  className="btn btn-secondary flex items-center justify-center space-x-2 hover-lift"
                >
                  <HelpingHand size={18} />
                  <span>Get Help</span>
                </button>
                
                <button
                  onClick={() => setShowTryOn(true)}
                  className="btn btn-ghost flex items-center justify-center space-x-2 hover-lift border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <Camera size={18} />
                  <span>Virtual Try-On</span>
                </button>

                <button
                  onClick={() => setShowHelperPoints(true)}
                  className="btn btn-outline flex items-center justify-center space-x-2 hover-lift"
                >
                  <Star size={18} />
                  <span>Helper Points</span>
                </button>
              </div>
              
            </div>

            {/* Vendor Info */}
            <div className="card-premium p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-navy-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-md">
                    {product?.vendor?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="heading-4 text-gray-900">
                      {product?.vendor?.name || 'Artisan Crafts Co.'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={product?.rating || 4.8} size="sm" />
                      <span className="text-sm text-gold-600 font-semibold">4.8 (127 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleLoginPrompt('view vendor profile') || navigate(`/vendor/${product?.vendor?.id || product?.vendor || 1}`)}
                    className="btn btn-outline flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => handleLoginPrompt('view vendor reviews') || navigate(`/reviews/vendor/${product?.vendor?.id || product?.vendor || 1}`)}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-navy-50 to-pink-50/30">
                <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-navy-600 rounded-xl flex items-center justify-center">
                  <Truck className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders over ₹999</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gold-50 to-pink-50/30">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Secure Payment</div>
                  <div className="text-xs text-gray-600">100% protected</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-navy-50/30">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <RotateCcw className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Easy Returns</div>
                  <div className="text-xs text-gray-600">30-day return</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="card bg-pattern-subtle">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                <button className="py-6 px-2 border-b-2 border-navy-600 text-navy-600 font-semibold transition-colors duration-300">
                  Description
                </button>
                <button className="py-6 px-2 border-b-2 border-transparent text-gray-500 hover:text-navy-600 font-semibold transition-colors duration-300">
                  Specifications
                </button>
                <button 
                  onClick={() => navigate(`/reviews/product/${product.id}`)}
                  className="py-6 px-2 border-b-2 border-transparent text-gray-500 hover:text-navy-600 font-semibold transition-colors duration-300 flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Reviews ({product.reviews || 0})</span>
                </button>
              </nav>
            </div>
            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.detailedDescription || product.description}
                </p>
                
                {product.specifications && (
                  <div className="mt-8">
                    <h4 className="heading-4 text-gray-900 mb-6">Specifications</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-4 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">{key}</span>
                          <span className="font-semibold text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.customerReviews && product.customerReviews.length > 0 && (
                  <div className="mt-8">
                    <h4 className="heading-4 text-gray-900 mb-6">Customer Reviews</h4>
                    <div className="space-y-6">
                      {product.customerReviews.slice(0, 3).map((review, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-gradient-to-r from-blue-50/30 to-transparent rounded-r-xl">
                          <div className="flex items-center mb-3">
                            <div className="flex text-orange-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-3 font-medium">{review.name}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Write Review Section */}
                {user && (
                  <div className="mt-8">
                    <h4 className="heading-4 text-gray-900 mb-6">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-2xl text-gray-300 hover:text-orange-500 transition-colors"
                            >
                              <Star 
                                size={24} 
                                fill={star <= reviewRating ? 'currentColor' : 'none'} 
                                className={star <= reviewRating ? 'text-orange-500' : 'text-gray-300'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review
                        </label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={4}
                          className="input w-full"
                          placeholder="Share your experience with this product..."
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={reviewRating === 0 || !reviewComment.trim() || submittingReview}
                        className="btn btn-primary"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Feature Modals */}
      {(showChat || showBidding || showAssistance || showHelperPoints || showTryOn) && (
        <div className="fixed inset-0 z-50">
        {showChat && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-large max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <RealTimeChat
                productId={product?.id}
                sellerId={product?.vendor?.id}
                onClose={() => setShowChat(false)}
              />
            </div>
          </div>
        )}
        
        {showBidding && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-large max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <LiveBidding
                product={product}
                onClose={() => setShowBidding(false)}
              />
            </div>
          </div>
        )}
        
        {showAssistance && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-large max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <PeerAssistance
                product={product}
                onClose={() => setShowAssistance(false)}
              />
            </div>
          </div>
        )}
        
        {showHelperPoints && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-large max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <HelperPoints
                onClose={() => setShowHelperPoints(false)}
              />
            </div>
          </div>
        )}
        

        {showTryOn && (
          <VirtualTryOn product={product} onClose={() => setShowTryOn(false)} />
        )}
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectTo={loginRedirectTo}
      />
    </div>
  )
}

export default ProductDetail
