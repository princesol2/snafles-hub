import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('snaflesOrders') || '[]')
    setOrders(savedOrders.reverse()) // Show newest first
    setLoading(false)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Clock className="text-yellow-500" size={20} />
      case 'Shipped':
        return <Truck className="text-blue-500" size={20} />
      case 'Delivered':
        return <CheckCircle className="text-green-500" size={20} />
      default:
        return <Package className="text-gray-500" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-16">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <Package size={64} className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h1>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <button className="btn btn-outline">
                    <Eye size={16} className="mr-2" />
                    View Details
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center text-gray-500 text-sm">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div className="text-sm text-gray-500">
                  {order.status === 'Processing' && 'We are preparing your order'}
                  {order.status === 'Shipped' && `Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}`}
                  {order.status === 'Delivered' && 'Order delivered successfully'}
                </div>
                
                <div className="flex space-x-2">
                  <button className="btn btn-outline text-sm">
                    Track Order
                  </button>
                  <button className="btn btn-outline text-sm">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
