import React, { useState } from 'react';
import { MessageSquare, DollarSign, Send, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NegotiationButton = ({ product, vendor }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNegotiate = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowModal(true);
    setProposedPrice(product.price * 0.8); // Suggest 20% discount
  };

  const handleSubmitNegotiation = async () => {
    if (!proposedPrice || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const negotiation = {
        id: `NEG-${Date.now()}`,
        product: {
          id: product.id,
          name: product.name,
          image: product.images[0],
          originalPrice: product.price
        },
        vendor: {
          id: vendor.id,
          name: vendor.name
        },
        customer: {
          id: user.id,
          name: user.name
        },
        proposedPrice: parseFloat(proposedPrice),
        message: message.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Store in localStorage for demo
      const negotiations = JSON.parse(localStorage.getItem('negotiations') || '[]');
      negotiations.push(negotiation);
      localStorage.setItem('negotiations', JSON.stringify(negotiations));

      toast.success('Negotiation request sent! The vendor will respond soon.');
      setShowModal(false);
      setProposedPrice('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send negotiation request');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <>
      <button
        onClick={handleNegotiate}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Negotiate Price</span>
      </button>

      {/* Negotiation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Negotiate Price</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">Vendor: {vendor.name}</p>
                    <p className="text-sm font-medium text-gray-900">
                      Original Price: {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Negotiation Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposed Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      placeholder="Enter your proposed price"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="1"
                      max={product.price}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested: {formatCurrency(product.price * 0.8)} (20% discount)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Vendor
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain why you think this price is fair..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">Negotiation Tips:</h5>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Be respectful and polite</li>
                    <li>• Explain your reasoning</li>
                    <li>• Consider bulk purchases for better deals</li>
                    <li>• Mention if you're a returning customer</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNegotiation}
                  disabled={loading || !proposedPrice || !message.trim()}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NegotiationButton;
