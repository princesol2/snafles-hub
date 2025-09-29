import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Star,
  Calendar,
  Download
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    revenue: {
      current: 1250000,
      previous: 980000,
      growth: 27.6
    },
    orders: {
      current: 234,
      previous: 189,
      growth: 23.8
    },
    users: {
      current: 156,
      previous: 134,
      growth: 16.4
    },
    products: {
      current: 89,
      previous: 76,
      growth: 17.1
    }
  });

  const [chartData, setChartData] = useState({
    revenue: [
      { month: 'Jan', value: 450000 },
      { month: 'Feb', value: 520000 },
      { month: 'Mar', value: 480000 },
      { month: 'Apr', value: 610000 },
      { month: 'May', value: 580000 },
      { month: 'Jun', value: 1250000 }
    ],
    orders: [
      { month: 'Jan', value: 45 },
      { month: 'Feb', value: 52 },
      { month: 'Mar', value: 48 },
      { month: 'Apr', value: 61 },
      { month: 'May', value: 58 },
      { month: 'Jun', value: 234 }
    ]
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const MetricCard = ({ title, value, previous, growth, icon: Icon, color, format = 'number' }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {format === 'currency' ? formatCurrency(value) : formatNumber(value)}
          </p>
          <div className="flex items-center mt-2">
            {growth > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth > 0 ? '+' : ''}{growth}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-end justify-between h-48 space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full bg-${color}-500 rounded-t`}
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
              ></div>
              <div className="text-xs text-gray-500 mt-2">{item.month}</div>
              <div className="text-xs font-medium text-gray-700">
                {title.includes('Revenue') ? formatCurrency(item.value) : item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={analytics.revenue.current}
          previous={analytics.revenue.previous}
          growth={analytics.revenue.growth}
          icon={DollarSign}
          color="bg-green-500"
          format="currency"
        />
        <MetricCard
          title="Total Orders"
          value={analytics.orders.current}
          previous={analytics.orders.previous}
          growth={analytics.orders.growth}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Users"
          value={analytics.users.current}
          previous={analytics.users.previous}
          growth={analytics.users.growth}
          icon={Users}
          color="bg-purple-500"
        />
        <MetricCard
          title="Total Products"
          value={analytics.products.current}
          previous={analytics.products.previous}
          growth={analytics.products.growth}
          icon={Package}
          color="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          data={chartData.revenue}
          title="Revenue Trend"
          color="green"
        />
        <SimpleChart
          data={chartData.orders}
          title="Orders Trend"
          color="blue"
        />
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
        <div className="space-y-4">
          {[
            { name: 'Jewelry', revenue: 450000, orders: 89, growth: 12.5 },
            { name: 'Home Decor', revenue: 320000, orders: 67, growth: 8.3 },
            { name: 'Electronics', revenue: 280000, orders: 45, growth: 15.2 },
            { name: 'Clothing', revenue: 200000, orders: 33, growth: 5.7 }
          ].map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-500">{category.orders} orders</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{formatCurrency(category.revenue)}</div>
                <div className="text-sm text-green-600">+{category.growth}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New order placed', user: 'Sarah Johnson', amount: 2999, time: '2 minutes ago' },
            { action: 'Product approved', user: 'Admin', product: 'Handmade Necklace', time: '15 minutes ago' },
            { action: 'Vendor registered', user: 'Artisan Crafts Co.', time: '1 hour ago' },
            { action: 'Payment processed', user: 'Mike Wilson', amount: 4599, time: '2 hours ago' },
            { action: 'Review submitted', user: 'Emma Davis', rating: 5, time: '3 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">{activity.action}</div>
                <div className="text-xs text-gray-500">
                  {activity.user} • {activity.time}
                  {activity.amount && ` • ${formatCurrency(activity.amount)}`}
                  {activity.rating && ` • ${activity.rating} stars`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

