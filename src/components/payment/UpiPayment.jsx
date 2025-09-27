import React, { useState } from 'react';
import { Smartphone, QrCode, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const UpiPayment = ({ amount, onSuccess, onError, orderId }) => {
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleUpiPayment = async (e) => {
    e.preventDefault();
    
    if (!upiId.trim()) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setLoading(true);
    try {
      // Create UPI payment intent
      const response = await paymentsAPI.createPaymentIntent({
        amount,
        currency: 'inr',
        orderId,
        paymentMethod: 'upi',
        upiId: upiId.trim()
      });

      setPaymentData(response);
      toast.success('UPI payment initiated');
    } catch (error) {
      console.error('UPI payment error:', error);
      toast.error('Failed to initiate UPI payment');
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  const copyUpiLink = () => {
    if (paymentData?.upiLink) {
      navigator.clipboard.writeText(paymentData.upiLink);
      setCopied(true);
      toast.success('UPI link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openUpiApp = () => {
    if (paymentData?.upiLink) {
      window.open(paymentData.upiLink, '_blank');
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData?.paymentIntentId) return;

    try {
      const response = await paymentsAPI.confirmPayment({
        paymentIntentId: paymentData.paymentIntentId,
        orderId
      });

      if (response.order?.paymentStatus === 'completed') {
        toast.success('Payment successful!');
        onSuccess && onSuccess(response);
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  if (paymentData) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <QrCode className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Complete Your UPI Payment
          </h3>
          <p className="text-green-700 mb-4">
            Scan the QR code or click the link below to complete your payment
          </p>
          
          <div className="space-y-4">
            {/* QR Code */}
            {paymentData.qrCode && (
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={paymentData.qrCode} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
            )}

            {/* UPI Link */}
            {paymentData.upiLink && (
              <div className="space-y-2">
                <button
                  onClick={openUpiApp}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center mx-auto"
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  Open UPI App
                </button>
                
                <button
                  onClick={copyUpiLink}
                  className="text-green-600 hover:text-green-700 flex items-center justify-center mx-auto text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy UPI Link
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Payment Details */}
            <div className="bg-white rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">UPI ID:</span>
                  <span className="font-mono">{upiId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
              </div>
            </div>

            {/* Status Check */}
            <button
              onClick={checkPaymentStatus}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Check Payment Status
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Payment Instructions</p>
              <ul className="mt-1 space-y-1">
                <li>• Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                <li>• Scan the QR code or use the UPI link</li>
                <li>• Enter your UPI PIN to complete the payment</li>
                <li>• Click "Check Payment Status" after payment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpiPayment} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">UPI Payment</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Smartphone className="h-4 w-4 mr-1" />
            UPI
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              placeholder="yourname@paytm or 9876543210@ybl"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your UPI ID (e.g., yourname@paytm, 9876543210@ybl)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
          <div className="text-sm text-green-800">
            <p className="font-medium">UPI Payment Benefits</p>
            <p>• Instant payment confirmation</p>
            <p>• No additional charges</p>
            <p>• Secure and encrypted</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Initiating UPI Payment...
          </div>
        ) : (
          <div className="flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            Pay ₹{amount.toLocaleString()} via UPI
          </div>
        )}
      </button>
    </form>
  );
};

export default UpiPayment;
