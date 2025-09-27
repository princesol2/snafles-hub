import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Refund = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    orderNumber: '',
    reason: '',
    description: '',
    refundMethod: 'original',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    }
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('bankDetails.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to request a refund')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Refund request submitted successfully!')
      navigate('/orders')
    } catch (error) {
      toast.error('Failed to submit refund request')
    } finally {
      setSubmitting(false)
    }
  }

  const refundReasons = [
    'Product damaged during shipping',
    'Wrong item received',
    'Product not as described',
    'Changed my mind',
    'Quality issues',
    'Other'
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
          <h1 className="text-3xl font-bold text-gray-900">Request Refund</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Refund Request Form</h2>
              
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

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Refund *
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select a reason</option>
                    {refundReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Please provide additional details about your refund request..."
                  />
                </div>

                {/* Refund Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Method *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="refundMethod"
                        value="original"
                        checked={formData.refundMethod === 'original'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span>Refund to original payment method</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="refundMethod"
                        value="bank"
                        checked={formData.refundMethod === 'bank'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span>Refund to bank account</span>
                    </label>
                  </div>
                </div>

                {/* Bank Details */}
                {formData.refundMethod === 'bank' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Bank Account Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.accountHolderName"
                        value={formData.bankDetails.accountHolderName}
                        onChange={handleInputChange}
                        className="input w-full"
                        required={formData.refundMethod === 'bank'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.accountNumber"
                        value={formData.bankDetails.accountNumber}
                        onChange={handleInputChange}
                        className="input w-full"
                        required={formData.refundMethod === 'bank'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.ifscCode"
                        value={formData.bankDetails.ifscCode}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="e.g., SBIN0001234"
                        required={formData.refundMethod === 'bank'}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn btn-primary py-3"
                >
                  {submitting ? 'Submitting Request...' : 'Submit Refund Request'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Refund Policy */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="mr-2 text-blue-600" />
                Refund Policy
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
                  <span>Refunds processed within 5-7 business days</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
                  <span>30-day return window from delivery date</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={16} />
                  <span>Full refund for damaged or wrong items</span>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="mr-2 text-orange-500 mt-0.5" size={16} />
                  <span>Return shipping costs may apply</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="mr-2 text-blue-600" />
                Refund Timeline
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
                  <span>Processing (3-5 days)</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span>Refund credited</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to help with your refund request.
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

export default Refund
