import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, MapPin, Shield, Package, Globe } from 'lucide-react';

const ShippingInfo = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      duration: '5-7 business days',
      price: '₹99',
      freeThreshold: 'Free on orders over ₹999',
      icon: Truck,
      description: 'Reliable delivery to your doorstep'
    },
    {
      name: 'Express Shipping',
      duration: '2-3 business days',
      price: '₹199',
      freeThreshold: 'Free on orders over ₹1999',
      icon: Clock,
      description: 'Fast delivery for urgent orders'
    },
    {
      name: 'Same Day Delivery',
      duration: 'Same day',
      price: '₹299',
      freeThreshold: 'Available in select cities',
      icon: Package,
      description: 'Ultra-fast delivery in major cities'
    }
  ];

  const shippingZones = [
    {
      zone: 'Metro Cities',
      cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'],
      duration: '1-3 days',
      icon: MapPin
    },
    {
      zone: 'Tier 2 Cities',
      cities: ['Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'],
      duration: '3-5 days',
      icon: Globe
    },
    {
      zone: 'Other Cities',
      cities: ['All other cities and towns'],
      duration: '5-7 days',
      icon: Truck
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-primary mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shipping Information</h1>
          <img
            src="/submarine.svg"
            alt="Submarine logo"
            title="Submarine"
            className="ml-auto h-10 w-10 opacity-90"
            loading="lazy"
          />
        </div>

        {/* Shipping Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.name}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{option.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-primary">{option.price}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {option.freeThreshold}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingZones.map((zone, index) => {
              const Icon = zone.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{zone.zone}</h3>
                      <p className="text-sm text-gray-600">Delivery: {zone.duration}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {zone.cities.map((city, cityIndex) => (
                      <span key={cityIndex}>
                        {city}
                        {cityIndex < zone.cities.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Policies</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Secure Packaging</h4>
                  <p className="text-sm text-gray-600">All items are carefully packaged to ensure safe delivery</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Processing Time</h4>
                  <p className="text-sm text-gray-600">Orders are processed within 1-2 business days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Tracking</h4>
                  <p className="text-sm text-gray-600">Real-time tracking available for all shipments</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">International Shipping</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Global Delivery</h4>
                  <p className="text-sm text-gray-600">We ship to most countries worldwide</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Customs & Duties</h4>
                  <p className="text-sm text-gray-600">Additional charges may apply for international orders</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Delivery Time</h4>
                  <p className="text-sm text-gray-600">7-14 business days for international orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-primary/5 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help with Shipping?</h3>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help with any shipping questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/help-center" className="btn btn-primary">
              Visit Help Center
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
