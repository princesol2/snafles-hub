import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, Eye, RefreshCw, Search } from 'lucide-react'
import { useOrders } from '../contexts/OrderContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Orders = () => {
  const { orders, loading, loadOrders, cancelOrder } = useOrders()
  const [cancellingOrder, setCancellingOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, amount-high, amount-low

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />
      case 'confirmed':
        return <Package className="text-blue-500" size={20} />
      case 'processing':
        return <Clock className="text-orange-500" size={20} />
      case 'shipped':
        return <Truck className="text-blue-500" size={20} />
      case 'out_for_delivery':
        return <Truck className="text-purple-500" size={20} />
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />
      case 'cancelled':
        return <Package className="text-red-500" size={20} />
      default:
        return <Package className="text-gray-500" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-orange-100 text-orange-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCancelOrder = async (orderId) => {
    setCancellingOrder(orderId)
    try {
      await cancelOrder(orderId, 'Cancelled by user')
      toast.success('Order cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel order')
    } finally {
      setCancellingOrder(null)
    }
  }

  const placeholderImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'

  const filteredOrders = useMemo(() => {
    let list = Array.isArray(orders) ? [...orders] : []
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(o =>
        String(o.orderNumber || '').toLowerCase().includes(q) ||
        String(o.id || o._id || '').toLowerCase().includes(q)
      )
    }
    switch (sortBy) {
      case 'oldest':
        list.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)); break
      case 'amount-high':
        list.sort((a,b) => (b.total || 0) - (a.total || 0)); break
      case 'amount-low':
        list.sort((a,b) => (a.total || 0) - (b.total || 0)); break
      default:
        list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return list
  }, [orders, statusFilter, query, sortBy])

  if (loading) {
    return (
      <div className="container py-16">
        <LoadingSpinner size="lg" text="Loading your orders..." />
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

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:max-w-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order number or ID"
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all','pending','confirmed','processing','shipped','delivered','cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-sm border ${statusFilter===s ? 'bg-primary text-white border-primary' : 'text-gray-600 hover:bg-gray-100 border-gray-200'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="md:ml-auto">
            <select
              value={sortBy}
              onChange={(e)=>setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id || order._id || order.orderNumber} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.orderNumber || order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/track-order/${order.orderNumber || order.id}`}
                      className="btn btn-outline text-sm"
                    >
                      <Truck size={16} className="mr-2" />
                      Track
                    </Link>
                    <Link
                      to={`/order-success/${order.id}`}
                      className="btn btn-outline text-sm"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Link>
                    {order.status === 'pending' || order.status === 'confirmed' ? (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrder === order.id}
                        className="btn btn-outline text-sm text-red-600 hover:bg-red-50"
                      >
                        {cancellingOrder === order.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image || item.images?.[0] || placeholderImage}
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
          {filteredOrders.length === 0 && (
            <div className="text-center text-gray-600 py-12">No orders match your filters.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
