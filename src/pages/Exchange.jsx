import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Exchange = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    orderNumber: '',
    reason: '',
    currentItem: '',
    desiredItem: '',
    size: '',
    color: '',
    description: '',
    exchangeMethod: 'pickup'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to request an exchange')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Exchange request submitted successfully!')
      navigate('/orders')
    } catch (error) {
      toast.error('Failed to submit exchange request')
    } finally {
      setSubmitting(false)
    }
  }

  const exchangeReasons = [
    'Wrong size',
    'Wrong color',
    'Changed my mind',
    'Product not as expected',
    'Quality issues',
    'Other'
  ]

  const exchangeMethods = [
    { value: 'pickup', label: 'Pickup & Delivery (Free)' },
    { value: 'store', label: 'Exchange at Store' },
    { value: 'shipping', label: 'Self Shipping (Reimbursed)' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Request Exchange</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Exchange Request Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter your order number"
                    required
                  />
                </div>

                {/* Current Item */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item to Exchange *
                  </label>
                  <input
                    type="text"
                    name="currentItem"
                    value={formData.currentItem}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Product name you want to exchange"
                    required
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Exchange *
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select a reason</option>
                    {exchangeReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Desired Item */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Item *
                  </label>
                  <input
                    type="text"
                    name="desiredItem"
                    value={formData.desiredItem}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Product name you want instead"
                    required
                  />
                </div>

                {/* Size and Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size (if applicable)
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color (if applicable)
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Blue, Red, Black"
                    />
                  </div>
                </div>

                {/* Exchange Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exchange Method *
                  </label>
                  <div className="space-y-3">
                    {exchangeMethods.map((method) => (
                      <label key={method.value} className="flex items-center">
                        <input
                          type="radio"
                          name="exchangeMethod"
                          value={method.value}
                          checked={formData.exchangeMethod === method.value}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input w-full"
                    placeholder="Please provide additional details about your exchange request..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn btn-primary py-3"
                >
                  {submitting ? 'Submitting Request...' : 'Submit Exchange Request'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exchange Policy */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <RefreshCw className="mr-2 text-blue-600" />
                Exchange Policy
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
                  <span>30-day exchange window from delivery date</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
                  <span>Free pickup and delivery for exchanges</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
                  <span>Items must be in original condition</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
                  <span>Price difference will be adjusted</span>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="mr-2 text-orange-500 mt-0.5" size={16} />
                  <span>Original packaging and tags required</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="mr-2 text-blue-600" />
                Exchange Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span>Request submitted</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span>Review & approval (1-2 days)</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span>Pickup scheduled (1-3 days)</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span>New item delivered (3-5 days)</span>
                </div>
              </div>
            </div>

            {/* Exchange Tips */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Exchange Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Keep original packaging and tags</li>
                <li>• Take photos if item is damaged</li>
                <li>• Check size charts before ordering</li>
                <li>• Contact us for size guidance</li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team can help you find the perfect exchange.
              </p>
              <button className="btn btn-outline w-full">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exchange
