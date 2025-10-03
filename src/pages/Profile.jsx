import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Settings, 
  Heart, 
  Star, 
  MessageSquare,
  ShoppingBag,
  Package,
  Award,
  TrendingUp,
  Eye,
  EyeOff,
  Camera,
  Share2,
  MoreVertical,
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  Gift,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import PaymentMethodManager from '../components/payment/PaymentMethodManager';
import AddressBook from '../components/account/AddressBook';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showStats, setShowStats] = useState(true);

  // Mock data for demonstration
  const [profileStats, setProfileStats] = useState({
    totalOrders: 24,
    totalSpent: 45600,
    wishlistItems: 12,
    reviews: 8,
    loyaltyPoints: 1250,
    memberSince: '2023-01-15',
    lastOrder: '2024-09-20',
    favoriteCategories: ['Jewelry', 'Electronics', 'Home Decor']
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-09-20',
      status: 'delivered',
      total: 2500,
      items: 2,
      vendor: 'Tanmay Arora'
    },
    {
      id: 'ORD-002',
      date: '2024-09-15',
      status: 'shipped',
      total: 1800,
      items: 1,
      vendor: 'Bani Makeovers'
    },
    {
      id: 'ORD-003',
      date: '2024-09-10',
      status: 'processing',
      total: 3200,
      items: 3,
      vendor: 'Artisan Crafts Co.'
    }
  ]);

  const [recentReviews, setRecentReviews] = useState([
    {
      id: 1,
      product: 'Traditional Kundan Necklace Set',
      rating: 5,
      comment: 'Absolutely stunning! The craftsmanship is exceptional.',
      date: '2024-09-18',
      vendor: 'Tanmay Arora'
    },
    {
      id: 2,
      product: 'Premium Makeup Kit',
      rating: 4,
      comment: 'Great quality products, perfect for daily use.',
      date: '2024-09-12',
      vendor: 'Bani Makeovers'
    }
  ]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'activity', name: 'Activity', icon: TrendingUp }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-gray-500 mb-4">{user?.email}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < 4 ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.2)</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate('/profile-settings')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Orders</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profileStats.totalOrders}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Total Spent</span>
                  </div>
                  <span className="font-semibold text-gray-900">₹{profileStats.totalSpent.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-sm text-gray-600">Wishlist</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profileStats.wishlistItems}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-sm text-gray-600">Reviews</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profileStats.reviews}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Account Summary */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Member Since</h4>
                      <p className="text-sm text-gray-500">{new Date(profileStats.memberSince).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Loyalty Points</h4>
                      <p className="text-sm text-gray-500">{profileStats.loyaltyPoints} points</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Last Order</h4>
                      <p className="text-sm text-gray-500">{new Date(profileStats.lastOrder).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Favorite Categories */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {profileStats.favoriteCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Order #ORD-001 delivered successfully</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">You reviewed "Traditional Kundan Necklace Set"</p>
                        <p className="text-xs text-gray-500">5 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Added "Premium Makeup Kit" to wishlist</p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All Orders
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.id}</h4>
                          <p className="text-sm text-gray-500">{order.vendor} • {order.items} item(s)</p>
                          <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <AddressBook />
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <PaymentMethodManager />
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All Items
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h4>
                  <p className="text-gray-500 mb-4">Start adding items you love to your wishlist</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Browse Products
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Your Reviews</h3>
                  <button
                    onClick={() => navigate('/reviews')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All Reviews
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.product}</h4>
                          <p className="text-sm text-gray-500">by {review.vendor}</p>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Order Delivered</h4>
                      <p className="text-sm text-gray-600">Order #ORD-001 was successfully delivered</p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Review Posted</h4>
                      <p className="text-sm text-gray-600">You reviewed "Traditional Kundan Necklace Set"</p>
                      <p className="text-xs text-gray-400">5 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Added to Wishlist</h4>
                      <p className="text-sm text-gray-600">Added "Premium Makeup Kit" to your wishlist</p>
                      <p className="text-xs text-gray-400">1 week ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Order Placed</h4>
                      <p className="text-sm text-gray-600">Order #ORD-002 was placed successfully</p>
                      <p className="text-xs text-gray-400">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
