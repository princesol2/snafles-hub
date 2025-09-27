import React, { useState } from 'react';
import { Truck, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CodPayment = ({ amount, onSuccess, onError, orderId }) => {
  const [loading, setLoading] = useState(false);
  const [codCharges, setCodCharges] = useState(0);
  const [totalAmount, setTotalAmount] = useState(amount);

  React.useEffect(() => {
    // Calculate COD charges (typically ₹50-100)
    const charges = amount > 500 ? 0 : 50; // Free COD above ₹500
    setCodCharges(charges);
    setTotalAmount(amount + charges);
  }, [amount]);

  const handleCodPayment = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // Create COD payment intent
      const response = await paymentsAPI.createPaymentIntent({
        amount: totalAmount,
        currency: 'inr',
        orderId,
        paymentMethod: 'cod',
        codCharges
      });

      toast.success('Order placed successfully! You can pay on delivery.');
      onSuccess && onSuccess(response);
      
    } catch (error) {
      console.error('COD payment error:', error);
      toast.error('Failed to place COD order');
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCodPayment} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cash on Delivery</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Truck className="h-4 w-4 mr-1" />
            COD
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Amount:</span>
                <span>₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">COD Charges:</span>
                <span className={codCharges > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {codCharges > 0 ? `₹${codCharges}` : 'FREE'}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {codCharges > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 mr-2" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">COD Charges Applied</p>
                  <p>₹{codCharges} COD charges added to your order.</p>
                </div>
              </div>
            </div>
          )}

          {codCharges === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Free COD Available</p>
                  <p>No COD charges for orders above ₹500!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Truck className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Cash on Delivery Benefits</p>
            <p>• Pay when you receive your order</p>
            <p>• No online payment required</p>
            <p>• Secure and convenient</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Delivery Information</p>
            <p>• Delivery time: 2-5 business days</p>
            <p>• Please keep exact change ready</p>
            <p>• You can inspect the product before payment</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
          <div className="text-sm text-red-800">
            <p className="font-medium">Important Notes</p>
            <p>• COD orders cannot be cancelled after dispatch</p>
            <p>• Please ensure someone is available to receive the order</p>
            <p>• Return policy applies as per standard terms</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Placing Order...
          </div>
        ) : (
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Place COD Order - ₹{totalAmount.toLocaleString()}
          </div>
        )}
      </button>
    </form>
  );
};

export default CodPayment;
