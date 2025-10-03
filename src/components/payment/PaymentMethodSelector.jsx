import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building2, Truck, Shield, CheckCircle, Award } from 'lucide-react';
import StripePayment from './StripePayment';
import UpiPayment from './UpiPayment';
import NetBankingPayment from './NetBankingPayment';
import CodPayment from './CodPayment';
import HelperPointsPayment from './HelperPointsPayment';

const PaymentMethodSelector = ({ amount, onSuccess, onError, orderId, onMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    if (onMethodChange) onMethodChange(selectedMethod);
  }, [selectedMethod]);

  const availableMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      color: 'blue',
      enabled: true
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, Paytm',
      icon: Smartphone,
      color: 'green',
      enabled: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks',
      icon: Building2,
      color: 'purple',
      enabled: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: Truck,
      color: 'orange',
      enabled: true
    },
    {
      id: 'helperpoints',
      name: 'Helper Points',
      description: 'Use community Helper Points to pay',
      icon: Award,
      color: 'orange',
      enabled: true
    }
  ];

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <StripePayment
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
            orderId={orderId}
          />
        );
      case 'upi':
        return (
          <UpiPayment
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
            orderId={orderId}
          />
        );
      case 'netbanking':
        return (
          <NetBankingPayment
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
            orderId={orderId}
          />
        );
      case 'cod':
        return (
          <CodPayment
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
            orderId={orderId}
          />
        );
      case 'helperpoints':
        return (
          <HelperPointsPayment
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
            orderId={orderId}
          />
        );
      default:
        return null;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 text-blue-700',
      green: 'border-green-200 bg-green-50 text-green-700',
      purple: 'border-purple-200 bg-purple-50 text-purple-700',
      orange: 'border-orange-200 bg-orange-50 text-orange-700'
    };
    return colors[color] || colors.blue;
  };

  const getSelectedColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-100 ring-2 ring-blue-500',
      green: 'border-green-500 bg-green-100 ring-2 ring-green-500',
      purple: 'border-purple-500 bg-purple-100 ring-2 ring-purple-500',
      orange: 'border-orange-500 bg-orange-100 ring-2 ring-orange-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? getSelectedColorClasses(method.color)
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected
                      ? getColorClasses(method.color)
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
          <div className="text-sm text-green-800">
            <p className="font-medium">Your payment is secure</p>
            <p>All transactions are encrypted and processed securely. We never store your payment details.</p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="border-t pt-6">
        {renderPaymentMethod()}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
