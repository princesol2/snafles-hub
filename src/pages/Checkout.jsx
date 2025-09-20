import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import StripePayment from '../components/payment/StripePayment'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

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

  const subtotal = getCartTotal()
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
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}`
    
    // Create order object
    const order = {
      id: orderId,
      items: cart,
      shipping: shippingInfo,
      payment: paymentInfo,
      total,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('snaflesOrders') || '[]')
    orders.push(order)
    localStorage.setItem('snaflesOrders', JSON.stringify(orders))
    
    // Clear cart
    clearCart()
    
    setLoading(false)
    setStep(3)
    toast.success('Order placed successfully!')
  }

  if (cart.length === 0) {
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
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="method"
                          value="card"
                          checked={paymentInfo.method === 'card'}
                          onChange={handlePaymentChange}
                          className="mr-3"
                        />
                        <CreditCard size={20} className="mr-3" />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="method"
                          value="upi"
                          checked={paymentInfo.method === 'upi'}
                          onChange={handlePaymentChange}
                          className="mr-3"
                        />
                        <span>UPI</span>
                      </label>
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="method"
                          value="cod"
                          checked={paymentInfo.method === 'cod'}
                          onChange={handlePaymentChange}
                          className="mr-3"
                        />
                        <Truck size={20} className="mr-3" />
                        <span>Cash on Delivery</span>
                      </label>
                    </div>
                  </div>

                  {paymentInfo.method === 'card' && (
                    <StripePayment
                      amount={total}
                      onSuccess={(paymentIntent) => {
                        console.log('Payment successful:', paymentIntent);
                        handlePlaceOrder();
                      }}
                      onError={(error) => {
                        console.error('Payment failed:', error);
                        toast.error('Payment failed. Please try again.');
                      }}
                      orderId={`ORD-${Date.now()}`}
                    />
                  )}

                  {paymentInfo.method === 'upi' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">UPI Payment</h4>
                        <p className="text-sm text-blue-800">
                          You will be redirected to your UPI app to complete the payment.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <div className="text-sm font-medium">PhonePe</div>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <div className="text-sm font-medium">Google Pay</div>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <div className="text-sm font-medium">Paytm</div>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <div className="text-sm font-medium">BHIM</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentInfo.method === 'cod' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Cash on Delivery</h4>
                      <p className="text-sm text-green-800">
                        Pay with cash when your order is delivered. An additional ₹50 COD charge applies.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 btn btn-outline py-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 btn btn-primary py-3"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="text-green-500 mb-4">
                    <CheckCircle size={64} className="mx-auto" />
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
                  {cart.map((item) => (
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
