import React, { useState, useEffect } from 'react';
import { Award, Shield, Users } from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const HelperPointsPayment = ({ amount, onSuccess, onError, orderId }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await paymentsAPI.createPaymentIntent({
        amount,
        currency: 'inr',
        orderId,
        paymentMethod: 'helperpoints'
      });
      toast.success('Helper Points authorized. Completing order...');
      onSuccess && onSuccess(response);
    } catch (error) {
      console.error('Helper Points payment error:', error);
      toast.error(error?.message || 'Helper Points payment failed');
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start">
          <Award className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
          <div className="text-sm text-orange-800">
            <p className="font-medium">Pay with Helper Points</p>
            <p>We will automatically use available community Helper Points to cover your order total.</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">No personal IOUs</p>
            <p>The platform manages reimbursements automatically when you top up your wallet later.</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn btn-secondary"
      >
        {loading ? 'Authorizing…' : `Pay ?${amount?.toLocaleString?.() || amount} with Helper Points`}
      </button>
    </form>
  );
};

export default HelperPointsPayment;

