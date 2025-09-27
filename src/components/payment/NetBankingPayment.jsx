import React, { useState } from 'react';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const NetBankingPayment = ({ amount, onSuccess, onError, orderId }) => {
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  const banks = [
    { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
    { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
    { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
    { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', code: 'KOTAK' },
    { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' },
    { id: 'bob', name: 'Bank of Baroda', code: 'BOB' },
    { id: 'canara', name: 'Canara Bank', code: 'CANARA' },
    { id: 'union', name: 'Union Bank of India', code: 'UNION' },
    { id: 'indian', name: 'Indian Bank', code: 'INDIAN' }
  ];

  const handleNetBankingPayment = async (e) => {
    e.preventDefault();
    
    if (!selectedBank) {
      toast.error('Please select your bank');
      return;
    }

    setLoading(true);
    try {
      // Create net banking payment intent
      const response = await paymentsAPI.createPaymentIntent({
        amount,
        currency: 'inr',
        orderId,
        paymentMethod: 'netbanking',
        bankCode: selectedBank
      });

      setPaymentData(response);
      toast.success('Redirecting to bank portal...');
      
      // In a real implementation, you would redirect to the bank's payment gateway
      // For demo purposes, we'll simulate a successful payment after 3 seconds
      setTimeout(() => {
        toast.success('Payment successful!');
        onSuccess && onSuccess(response);
      }, 3000);
      
    } catch (error) {
      console.error('Net banking payment error:', error);
      toast.error('Failed to initiate net banking payment');
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  if (paymentData) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Redirecting to Bank Portal
          </h3>
          <p className="text-blue-700 mb-4">
            You will be redirected to your bank's secure payment portal
          </p>
          
          <div className="bg-white rounded-lg p-4 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank:</span>
                <span className="font-semibold">{banks.find(b => b.id === selectedBank)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono">{orderId}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-blue-600 mt-2">Processing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleNetBankingPayment} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Net Banking</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="h-4 w-4 mr-1" />
            Net Banking
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose your bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Net Banking Benefits</p>
            <p>• Direct bank transfer</p>
            <p>• Secure bank authentication</p>
            <p>• No additional charges</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Important</p>
            <p>You will be redirected to your bank's secure portal. Please complete the payment there.</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !selectedBank}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Redirecting to Bank...
          </div>
        ) : (
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Pay ₹{amount.toLocaleString()} via Net Banking
          </div>
        )}
      </button>
    </form>
  );
};

export default NetBankingPayment;
