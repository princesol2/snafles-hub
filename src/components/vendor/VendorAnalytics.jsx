import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Users,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

const VendorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  const analyticsData = {
    overview: {
      totalRevenue: 125000,
      totalOrders: 156,
      totalProducts: 24,
      averageRating: 4.7,
      revenueChange: 15.2,
      ordersChange: 8.5,
      productsChange: 12.0,
      ratingChange: 2.1
    },
    salesData: [
      { month: 'Jan', sales: 12000 },
      { month: 'Feb', sales: 15000 },
      { month: 'Mar', sales: 18000 },
      { month: 'Apr', sales: 22000 },
      { month: 'May', sales: 25000 },
      { month: 'Jun', sales: 28000 }
    ],
    topProducts: [
      { name: 'Handcrafted Silver Necklace', sales: 45, revenue: 134955, rating: 4.7 },
      { name: 'Ceramic Vase Set', sales: 32, revenue: 79968, rating: 4.5 },
      { name: 'Wooden Wall Art', sales: 15, revenue: 68985, rating: 4.9 },
      { name: 'Leather Handbag', sales: 28, revenue: 100772, rating: 4.4 },
      { name: 'Cotton Scarf', sales: 22, revenue: 28578, rating: 4.6 }
    ],
    orderStatus: [
      { status: 'Pending', count: 8, percentage: 5.1 },
      { status: 'Processing', count: 12, percentage: 7.7 },
      { status: 'Shipped', count: 25, percentage: 16.0 },
      { status: 'Delivered', count: 111, percentage: 71.2 }
    ],
    customerInsights: {
      newCustomers: 45,
      returningCustomers: 111,
      averageOrderValue: 801.28,
      customerSatisfaction: 4.7
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% from last period
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Simulate data export
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics & Reports</h3>
          <p className="text-sm text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.overview.totalRevenue)}
          icon={DollarSign}
          change={analyticsData.overview.revenueChange}
          changeType="positive"
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(analyticsData.overview.totalOrders)}
          icon={ShoppingCart}
          change={analyticsData.overview.ordersChange}
          changeType="positive"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={formatNumber(analyticsData.overview.totalProducts)}
          icon={Package}
          change={analyticsData.overview.productsChange}
          changeType="positive"
          color="bg-purple-500"
        />
        <StatCard
          title="Average Rating"
          value={analyticsData.overview.averageRating}
          icon={Star}
          change={analyticsData.overview.ratingChange}
          changeType="positive"
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Sales Overview</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Sales chart will be displayed here</p>
              <p className="text-sm text-gray-400 mt-1">
                Integration with charting library (Chart.js, Recharts, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h4>
          <div className="space-y-4">
            {analyticsData.orderStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{item.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h4>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {product.sales} sales • {product.rating}★ rating
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</div>
                  <div className="text-sm text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h4>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{analyticsData.customerInsights.newCustomers}</div>
                <div className="text-sm text-blue-700">New Customers</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{analyticsData.customerInsights.returningCustomers}</div>
                <div className="text-sm text-green-700">Returning Customers</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(analyticsData.customerInsights.averageOrderValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-semibold text-gray-900">
                    {analyticsData.customerInsights.customerSatisfaction}/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {[
            { action: 'New order received', order: 'ORD-001', time: '2 hours ago', type: 'order' },
            { action: 'Product updated', product: 'Handcrafted Silver Necklace', time: '4 hours ago', type: 'product' },
            { action: 'Order shipped', order: 'ORD-002', time: '6 hours ago', type: 'shipping' },
            { action: 'New review received', product: 'Ceramic Vase Set', rating: 5, time: '1 day ago', type: 'review' },
            { action: 'Product added', product: 'Leather Handbag', time: '2 days ago', type: 'product' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center py-2">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                activity.type === 'order' ? 'bg-blue-500' :
                activity.type === 'product' ? 'bg-green-500' :
                activity.type === 'shipping' ? 'bg-purple-500' : 'bg-yellow-500'
              }`}></div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">{activity.action}</div>
                <div className="text-xs text-gray-500">
                  {activity.order && `Order ${activity.order}`}
                  {activity.product && `Product: ${activity.product}`}
                  {activity.rating && ` • ${activity.rating}★ rating`}
                  {` • ${activity.time}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
