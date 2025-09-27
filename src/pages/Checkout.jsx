import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Truck, Shield, CheckCircle, ArrowLeft } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../contexts/OrderContext'
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cart, getCartTotal, clearCart, addToCart } = useCart()
  const { user } = useAuth()
  const { createOrder, processPayment, confirmPayment } = useOrders()
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [directProduct, setDirectProduct] = useState(null)

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'India'
  })

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })

  // Handle direct product purchase
  useEffect(() => {
    if (location.state?.product) {
      setDirectProduct(location.state.product)
      // Don't add to cart for direct purchase - handle separately
    }
  }, [location.state])

  // Calculate totals - handle both cart items and direct product purchase
  const getSubtotal = () => {
    if (directProduct) {
      return directProduct.price * (directProduct.quantity || 1)
    }
    return getCartTotal()
  }
  
  const subtotal = getSubtotal()
  const shipping = subtotal > 999 ? 0 : 99
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setProcessingPayment(true)
    
    try {
      // Create order data - handle both cart items and direct product purchase
      // Backend expects { product: productId, quantity: number } format
      const orderItems = directProduct 
        ? [{
            product: directProduct.id || directProduct._id,
            quantity: directProduct.quantity || 1
          }]
        : cart.map(item => ({
            product: item.id,
            quantity: item.quantity
          }))

      const orderData = {
        items: orderItems,
        shipping: shippingInfo,
        payment: paymentInfo,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }

      // Create the order
      const orderResponse = await createOrder(orderData)
      const order = orderResponse.order

      // Process payment
      const paymentResponse = await processPayment(order.id, {
        method: paymentInfo.method,
        amount: total,
        ...paymentInfo
      })

      // Simulate payment confirmation (in real app, this would be handled by payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Confirm payment
      await confirmPayment(paymentResponse.paymentIntentId)

      // Clear cart only if not a direct product purchase
      if (!directProduct) {
        clearCart()
      }
      
      setLoading(false)
      setProcessingPayment(false)
      setStep(3)
      
      toast.success('Order placed successfully!')
      
      // Redirect to order success page after a short delay
      setTimeout(() => {
        navigate(`/order-success/${order.id}`)
      }, 2000)
      
    } catch (error) {
      setLoading(false)
      setProcessingPayment(false)
      toast.error(error.message || 'Failed to place order. Please try again.')
      console.error('Order placement error:', error)
    }
  }

  if (cart.length === 0 && !directProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="input"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full btn btn-primary py-3"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                  

                  <PaymentMethodSelector
                    amount={total}
                    onSuccess={(paymentData) => {
                      console.log('Payment successful:', paymentData);
                      handlePlaceOrder();
                    }}
                    onError={(error) => {
                      console.error('Payment failed:', error);
                      toast.error('Payment failed. Please try again.');
                    }}
                    orderId={`ORD-${Date.now()}`}
                  />


                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 btn btn-outline py-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading || processingPayment}
                      className="flex-1 btn btn-primary py-3"
                    >
                      {processingPayment ? (
                        <span className="flex items-center justify-center space-x-2">
                          <LoadingSpinner size="sm" color="white" />
                          <span>Processing Payment...</span>
                        </span>
                      ) : loading ? (
                        'Creating Order...'
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="text-green-500 mb-4 relative overflow-x-hidden h-20">
                    <CheckCircle size={48} className="mx-auto mb-2" />
                    <div className="absolute left-0 right-0 top-10">
                      <div className="inline-flex items-center space-x-2 truck-animate">
                        <Truck size={28} className="text-blue-600" />
                        <span className="text-sm text-gray-600">Your order is on its way!</span>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your order. We'll send you a confirmation email shortly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/orders')}
                      className="btn btn-primary"
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() => navigate('/products')}
                      className="btn btn-outline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  {(directProduct ? [{
                    id: directProduct.id,
                    name: directProduct.name,
                    price: directProduct.price,
                    image: directProduct.image || directProduct.images?.[0],
                    quantity: directProduct.quantity || 1,
                    vendor: directProduct.vendor?.name || directProduct.vendor || 'SNAFLEShub',
                    category: directProduct.category
                  }] : cart).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-semibold mb-4">Security Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="text-green-500" size={20} />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="text-blue-500" size={20} />
                    <span className="text-sm">Fast Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-purple-500" size={20} />
                    <span className="text-sm">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
