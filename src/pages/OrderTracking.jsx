import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, trackOrder, currentOrder } = useOrders();
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState(orderId || '');

  useEffect(() => {
    if (orderId) {
      loadOrderAndTracking();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrderAndTracking = async () => {
    setLoading(true);
    try {
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(orderId);
      if (isObjectId) {
        const res = await getOrder(orderId);
        const ordNum = res?.order?.orderNumber;
        if (ordNum) {
          const tracking = await trackOrder(ordNum);
          setTrackingData(tracking);
        }
      } else {
        const tracking = await trackOrder(orderId);
        setTrackingData(tracking);
      }
    } catch (error) {
      toast.error('Failed to load order tracking information');
      console.error('Error loading tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchOrderId.trim()) {
      toast.error('Please enter an order number');
      return;
    }
    
    navigate(`/track-order/${searchOrderId.trim()}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'out_for_delivery': return 'text-orange-600 bg-orange-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'processing': return <Package className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'out_for_delivery': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <AlertCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getTrackingSteps = () => {
    const steps = [
      { id: 'confirmed', label: 'Order Confirmed', description: 'Your order has been confirmed and payment processed' },
      { id: 'processing', label: 'Processing', description: 'Your order is being prepared for shipment' },
      { id: 'shipped', label: 'Shipped', description: 'Your order has been shipped and is on its way' },
      { id: 'out_for_delivery', label: 'Out for Delivery', description: 'Your order is out for delivery' },
      { id: 'delivered', label: 'Delivered', description: 'Your order has been delivered successfully' }
    ];

    const currentStatus = (currentOrder?.status || trackingData?.order?.status) || 'confirmed';
    const currentIndex = steps.findIndex(step => step.id === currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading tracking information..." />
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
            <p className="text-gray-600">Enter your order number to track your package</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="orderId"
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    placeholder="Enter your order number (e.g., ORD-1696240000-ABCDE)"
                    className="input pl-10"
                    required
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary w-full">
                Track Order
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const order = currentOrder || trackingData?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order number you entered could not be found.</p>
          <button
            onClick={() => navigate('/track-order')}
            className="btn btn-primary"
          >
            Try Another Order
          </button>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-600">Track your package in real-time</p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order #{order.orderNumber}</h2>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              <span className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status.replace('_', ' ')}</span>
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Total Items</h3>
              <p className="text-2xl font-bold text-blue-600">{order.items?.length || 0}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Delivery Address</h3>
              <p className="text-sm text-gray-600">
                {order.shipping?.city}, {order.shipping?.state}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Estimated Delivery</h3>
              <p className="text-sm text-gray-600">
                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Tracking Timeline</h3>
          
          <div className="space-y-6">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-100 text-green-600' 
                    : step.current 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <div className={`w-3 h-3 rounded-full ${
                      step.current ? 'bg-blue-600' : 'bg-gray-400'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm ${
                    step.completed || step.current ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                  
                  {trackingData?.timeline?.[step.id] && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(trackingData.timeline[step.id]).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Details */}
        {trackingData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Tracking Details</h3>
            
            {trackingData.carrier && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Shipping Carrier</h4>
                <p className="text-gray-600">{trackingData.carrier}</p>
              </div>
            )}
            
            {trackingData.trackingNumber && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Tracking Number</h4>
                <p className="text-gray-600 font-mono">{trackingData.trackingNumber}</p>
              </div>
            )}
            
            {trackingData.estimatedDelivery && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Estimated Delivery</h4>
                <p className="text-gray-600">
                  {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            )}
            
            {trackingData.currentLocation && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Location</h4>
                <p className="text-gray-600">{trackingData.currentLocation}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/orders')}
            className="btn btn-primary"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

