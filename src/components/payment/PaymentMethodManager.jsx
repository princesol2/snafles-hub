import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Trash2, Plus, Shield, AlertCircle } from 'lucide-react';

const PaymentMethodManager = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    last4: '',
    brand: '',
    expiryMonth: '',
    expiryYear: ''
  });

  // Mock payment methods for demo
  useEffect(() => {
    setPaymentMethods([
      {
        id: '1',
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: '12',
        expiryYear: '2025',
        isDefault: true
      },
      {
        id: '2',
        type: 'card',
        brand: 'Mastercard',
        last4: '5555',
        expiryMonth: '08',
        expiryYear: '2026',
        isDefault: false
      }
    ]);
  }, []);

  const handleDeleteMethod = async (methodId) => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      setMessage({ type: 'success', text: 'Payment method removed successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove payment method' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === methodId
        }))
      );
      setMessage({ type: 'success', text: 'Default payment method updated' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update default payment method' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    
    if (!newMethod.last4 || !newMethod.brand || !newMethod.expiryMonth || !newMethod.expiryYear) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const method = {
        id: Date.now().toString(),
        ...newMethod,
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods(prev => [...prev, method]);
      setNewMethod({
        type: 'card',
        last4: '',
        brand: '',
        expiryMonth: '',
        expiryYear: ''
      });
      setShowAddForm(false);
      setMessage({ type: 'success', text: 'Payment method added successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add payment method' });
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = (brand) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-white">
            Payment Methods
          </h2>
          <p className="text-gray-600 text-gray-400 mt-1">
            Manage your saved payment methods securely
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Method
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 text-blue-200">
              Secure Payment Storage
            </h3>
            <p className="text-sm text-blue-700 text-blue-300 mt-1">
              We never store your full card details. Only the last 4 digits and expiry date 
              are saved for your convenience. All sensitive data is encrypted and handled 
              by our secure payment partners.
            </p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 text-white mb-2">
              No payment methods
            </h3>
            <p className="text-gray-600 text-gray-400 mb-4">
              Add a payment method to make checkout faster
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              Add Payment Method
            </button>
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white bg-gray-800 border border-gray-200 border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getCardIcon(method.brand)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 text-white">
                        {method.brand} •••• {method.last4}
                      </h3>
                      {method.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-gray-400">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      disabled={loading}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 text-white mb-4">
              Add Payment Method
            </h3>
            
            <form onSubmit={handleAddMethod} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                  Card Brand
                </label>
                <select
                  value={newMethod.brand}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, brand: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">Select brand</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  value={newMethod.last4}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, last4: e.target.value }))}
                  className="input w-full"
                  placeholder="1234"
                  maxLength="4"
                  pattern="[0-9]{4}"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    Expiry Month
                  </label>
                  <select
                    value={newMethod.expiryMonth}
                    onChange={(e) => setNewMethod(prev => ({ ...prev, expiryMonth: e.target.value }))}
                    className="input w-full"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    Expiry Year
                  </label>
                  <select
                    value={newMethod.expiryYear}
                    onChange={(e) => setNewMethod(prev => ({ ...prev, expiryYear: e.target.value }))}
                    className="input w-full"
                    required
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Adding...' : 'Add Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodManager;
