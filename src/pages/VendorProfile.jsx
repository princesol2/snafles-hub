import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  Users, 
  Package, 
  MessageSquare,
  Heart,
  Share2,
  Filter,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { vendorsAPI } from '../services/api';
import ReviewStats from '../components/reviews/ReviewStats';
import ReviewCard from '../components/reviews/ReviewCard';
import StarRating from '../components/reviews/StarRating';
import toast from 'react-hot-toast';

const VendorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProductsByVendor, getVendorById } = useProducts();
  
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/vendors')
      return
    }
    loadVendorData();
  }, [id]);

  const loadVendorData = async () => {
    setLoading(true);
    try {
      // Real API: fetch vendor + products
      const { vendor: vendorRes, products: productsRes } = await vendorsAPI.getVendor(id);
      setVendor(vendorRes);
      setProducts(productsRes || []);
      setReviews([]);
    } catch (error) {
      // Fallback to any already-loaded context data (still real API)
      const fallbackVendor = getVendorById(id);
      if (fallbackVendor) {
        setVendor(fallbackVendor);
        setProducts(getProductsByVendor(id));
        setReviews([]);
      } else {
        toast.error('Failed to load vendor profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed vendor' : 'Following vendor');
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to negotiation or contact form
    navigate('/negotiations');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h2>
          <p className="text-gray-600 mb-6">The vendor you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/vendors')}
            className="btn btn-primary"
          >
            Browse Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={vendor.banner || vendor.coverImage || vendor.image}
          alt="Vendor cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Vendor Logo */}
            <div className="relative">
              <img
                src={vendor.logo || vendor.image}
                alt={vendor.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              {vendor.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Vendor Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {vendor.name}
                    {vendor.isVerified && (
                      <span className="ml-2 text-blue-500 text-sm font-normal">
                        ✓ Verified
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {vendor.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {formatDate(vendor.joinDate || vendor.joinedDate || vendor.createdAt || new Date().toISOString())}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <StarRating rating={vendor.rating} size="sm" />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {vendor.rating} ({vendor.reviews ?? 0} reviews)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {(vendor.totalSales ?? 0)} sales
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button
                    onClick={handleContact}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mt-4 leading-relaxed">
                {vendor.description}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-4">
                {vendor.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{products.length}</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{vendor.totalSales ?? 0}</div>
            <div className="text-sm text-gray-600">Sales</div>
          </div>
          {/* Additional stats can be shown here if available */}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'products', name: 'Products', icon: Package },
              { id: 'reviews', name: 'Reviews', icon: Star },
              { id: 'about', name: 'About', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
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
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${product._id || product.id}`)}
              >
                <img
                  src={(product.images && product.images[0]) || product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      <StarRating rating={product.rating || 4.5} size="sm" />
                      <span className="ml-1 text-sm text-gray-600">
                        ({product.reviews || 0})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ReviewStats reviews={reviews} type="vendor" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">{vendor.location}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Joined:</span>
                    <span className="ml-2 text-gray-600">{formatDate(vendor.joinedDate || vendor.joinDate || vendor.createdAt || new Date().toISOString())}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Languages:</span>
                    <span className="ml-2 text-gray-600">{(vendor.languages || []).join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Response Time:</span>
                    <span className="ml-2 text-gray-600">{vendor.responseTime}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">On-time Delivery</span>
                    <span className="font-medium text-gray-900">{vendor.stats?.onTimeDelivery ?? 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Order Completion</span>
                    <span className="font-medium text-gray-900">{vendor.stats?.orderCompletion ?? 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Repeat Customers</span>
                    <span className="font-medium text-gray-900">{vendor.stats?.repeatCustomers ?? 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;




