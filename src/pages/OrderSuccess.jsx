import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Download, ArrowLeft } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, trackOrder, currentOrder } = useOrders();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [publicOrder, setPublicOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) { setLoading(false); return; }
      try {
        const isObjectId = /^[a-fA-F0-9]{24}$/.test(orderId);
        if (isObjectId) {
          await getOrder(orderId);
        } else {
          const tr = await trackOrder(orderId);
          if (tr && tr.order) setPublicOrder(tr.order);
        }
      } catch (error) {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
    
    // Clear cart after successful order
    clearCart();
  }, [orderId, getOrder, navigate, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading order details..." />
      </div>
    );
  }

  const order = currentOrder || publicOrder;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link to="/orders" className="btn btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
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
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              <span className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  {order.total !== undefined ? (
                    <span className="font-medium text-lg">₹{order.total}</span>
                  ) : (
                    <span className="font-medium text-lg">—</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{order.payment?.method || '—'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{order.shipping?.firstName} {order.shipping?.lastName}</p>
                <p>{order.shipping?.address}</p>
                <p>{order.shipping?.city}, {order.shipping?.state} {order.shipping?.zipCode}</p>
                <p>{order.shipping?.country}</p>
                <p className="mt-2">📞 {order.shipping?.phone}</p>
                <p>📧 {order.shipping?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h3>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  {item.selectedVariant && (
                    <p className="text-sm text-gray-600">
                      Variant: {item.selectedVariant.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                  <p className="text-sm text-gray-600">₹{item.price} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          {(order.total !== undefined || order.subtotal !== undefined) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                {order.subtotal !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>₹{order.shippingCost ?? 0}</span>
                </div>
                {order.tax !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST):</span>
                    <span>₹{order.tax}</span>
                  </div>
                )}
                {order.total !== undefined && (
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{order.total}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="btn btn-primary flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>View All Orders</span>
          </Link>
          
          <button
            onClick={() => window.print()}
            className="btn btn-outline flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
          
          <Link
            to="/products"
            className="btn btn-ghost flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• You'll receive an email confirmation shortly</p>
            <p>• We'll process your order within 1-2 business days</p>
            <p>• You'll get tracking information once your order ships</p>
            <p>• Expected delivery: 3-7 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

