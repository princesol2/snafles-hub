import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authAPI, productsAPI, vendorsAPI, api } from '../services/api';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  Shield,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Star,
  Store,
  Plus,
  X,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import AdminControls from '../components/admin/AdminControls';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeNegotiations: 0,
    platformRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    description: '',
    categories: [],
    logo: '',
    banner: ''
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    password: '',
    confirmPassword: ''
  });
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Jewelry',
    vendor: '',
    imagesInput: '',
    stock: ''
  });
  const [vendorOptions, setVendorOptions] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin-login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      
      if (response && response.stats) {
        setStats(response.stats);
      } else {
        // Fallback to mock data if API fails
        setStats({
          totalUsers: 156,
          totalVendors: 23,
          totalProducts: 89,
          totalOrders: 234,
          totalRevenue: 1250000,
          pendingApprovals: 12,
          activeNegotiations: 8,
          platformRating: 4.7
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data if API fails
      setStats({
        totalUsers: 156,
        totalVendors: 23,
        totalProducts: 89,
        totalOrders: 234,
        totalRevenue: 1250000,
        pendingApprovals: 12,
        activeNegotiations: 8,
        platformRating: 4.7
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      if (!newVendor.logo || !newVendor.banner) {
        alert('Logo URL and Banner URL are required');
        return;
      }
      if (!newVendor.description || newVendor.description.length < 10) {
        alert('Description must be at least 10 characters');
        return;
      }

      const payload = {
        name: newVendor.name,
        description: newVendor.description,
        location: newVendor.location,
        categories: newVendor.categories,
        logo: newVendor.logo,
        banner: newVendor.banner,
        contact: {
          email: newVendor.email,
          phone: newVendor.phone,
          website: newVendor.website
        }
      };

      await api.post('/vendors', payload);
      
      // Reset form
      setNewVendor({
        name: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        description: '',
        categories: [],
        logo: '',
        banner: ''
      });
      setShowAddVendorModal(false);
      
      // Refresh dashboard data
      loadDashboardData();
      
      alert('Vendor added successfully!');
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setNewVendor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (!newUser.password || newUser.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }
      if (newUser.password !== newUser.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const registerRes = await authAPI.register({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone
      });

      const createdUserId = registerRes?.user?.id;
      const requestedStatus = newUser.status;
      if (createdUserId && requestedStatus && requestedStatus !== 'active') {
        const statusMap = { inactive: 'inactive', suspended: 'banned', active: 'active' };
        const mapped = statusMap[requestedStatus] || 'active';
        if (mapped !== 'active') {
          await adminAPI.updateUserStatus(createdUserId, mapped);
        }
      }
      if (newUser.role && newUser.role !== 'customer') {
        console.warn('Role selection is currently informational only; backend lacks a role update endpoint.');
      }
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
        password: '',
        confirmPassword: ''
      });
      setShowAddUserModal(false);
      
      // Refresh dashboard data
      loadDashboardData();
      
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleUserInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openAddProductModal = async () => {
    setShowAddProductModal(true);
    try {
      const data = await vendorsAPI.getVendors({ limit: 100 });
      const list = data?.vendors || data?.data?.vendors || [];
      setVendorOptions(list);
    } catch (error) {
      console.error('Error loading vendors:', error);
      alert('Failed to load vendors for product creation.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const images = (newProduct.imagesInput || '')
        .split(/\n|,/)
        .map(s => s.trim())
        .filter(Boolean);

      if (!images.length) {
        alert('Please provide at least one image URL');
        return;
      }
      if (!newProduct.vendor) {
        alert('Please select a vendor');
        return;
      }

      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        vendor: newProduct.vendor,
        images,
        stock: parseInt(newProduct.stock || '0', 10)
      };

      await productsAPI.createProduct(payload);

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: 'Jewelry',
        vendor: '',
        imagesInput: '',
        stock: ''
      });
      setShowAddProductModal(false);
      loadDashboardData();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
          change={12.5}
          changeType="positive"
        />
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors.toLocaleString()}
          icon={Store}
          color="bg-green-500"
          change={8.2}
          changeType="positive"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          color="bg-purple-500"
          change={15.3}
          changeType="positive"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="bg-yellow-500"
          change={22.1}
          changeType="positive"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={AlertTriangle}
          color="bg-orange-500"
          change={-5.2}
          changeType="negative"
        />
        <StatCard
          title="Platform Rating"
          value={stats.platformRating}
          icon={Star}
          color="bg-indigo-500"
          change={3.2}
          changeType="positive"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="bg-teal-500"
          change={14.8}
          changeType="positive"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowAddVendorModal(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors"
            >
              <Store className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Add Vendor</div>
            </button>
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors"
            >
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Add User</div>
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors"
            >
              <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Manage Products</div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Platform Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New vendor registered', user: 'Artisan Crafts Co.', time: '2 hours ago', type: 'vendor' },
              { action: 'Product approved', user: 'Handmade Treasures', time: '4 hours ago', type: 'product' },
              { action: 'Order completed', user: 'Sarah Johnson', time: '6 hours ago', type: 'order' },
              { action: 'Payment processed', user: 'Emma Davis', time: '10 hours ago', type: 'payment' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center py-2">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'vendor' ? 'bg-green-500' :
                  activity.type === 'product' ? 'bg-blue-500' :
                  activity.type === 'order' ? 'bg-purple-500' :
                  activity.type === 'negotiation' ? 'bg-pink-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.user} • {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const VendorsTab = () => {
    const [vendors, setVendors] = useState([]);
    const [vendorsLoading, setVendorsLoading] = useState(false);

    const loadVendors = async () => {
      setVendorsLoading(true);
      try {
        const response = await adminAPI.getVendors({ limit: 50 });
        setVendors(response.vendors || []);
      } catch (error) {
        console.error('Error loading vendors:', error);
        // Fallback to mock data
        setVendors([
          { _id: '1', name: 'Artisan Crafts Co.', email: 'artisan@example.com', isVerified: true, isActive: true, createdAt: '2024-01-15' },
          { _id: '2', name: 'Handmade Treasures', email: 'handmade@example.com', isVerified: false, isActive: true, createdAt: '2024-01-10' },
          { _id: '3', name: 'Creative Home Studio', email: 'creative@example.com', isVerified: true, isActive: true, createdAt: '2024-01-08' },
          { _id: '4', name: 'Vintage Finds', email: 'vintage@example.com', isVerified: true, isActive: false, createdAt: '2024-01-05' }
        ]);
      } finally {
        setVendorsLoading(false);
      }
    };

    useEffect(() => {
      loadVendors();
    }, []);

    const handleVendorStatusUpdate = async (vendorId, isVerified) => {
      try {
        await adminAPI.updateVendorStatus(vendorId, { isVerified });
        setVendors(prev => prev.map(v => 
          v._id === vendorId ? { ...v, isVerified } : v
        ));
        alert(`Vendor ${isVerified ? 'verified' : 'unverified'} successfully!`);
      } catch (error) {
        console.error('Error updating vendor status:', error);
        alert('Failed to update vendor status');
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Vendor Management</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowAddVendorModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </button>
            <button 
              onClick={loadVendors}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {vendorsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Store className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vendor.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleVendorStatusUpdate(vendor._id, !vendor.isVerified)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            vendor.isVerified 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {vendor.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const response = await adminAPI.getUsers({ limit: 50 });
        setUsers(response.users || []);
      } catch (error) {
        console.error('Error loading users:', error);
        // Fallback to mock data
        setUsers([
          { _id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'customer', isActive: true, createdAt: '2024-01-15' },
          { _id: '2', name: 'Mike Wilson', email: 'mike@example.com', role: 'customer', isActive: true, createdAt: '2024-01-10' },
          { _id: '3', name: 'Emma Davis', email: 'emma@example.com', role: 'vendor', isActive: true, createdAt: '2024-01-08' },
          { _id: '4', name: 'John Smith', email: 'john@example.com', role: 'customer', isActive: false, createdAt: '2024-01-05' }
        ]);
      } finally {
        setUsersLoading(false);
      }
    };

    useEffect(() => {
      loadUsers();
    }, []);

    const handleUserStatusUpdate = async (userId, status) => {
      try {
        await adminAPI.updateUserStatus(userId, status);
        setUsers(prev => prev.map(u => {
          if (u._id === userId) {
            return {
              ...u,
              isActive: status === 'active',
              isBanned: status === 'banned'
            };
          }
          return u;
        }));
        alert(`User status updated to ${status} successfully!`);
      } catch (error) {
        console.error('Error updating user status:', error);
        alert('Failed to update user status');
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
            <button 
              onClick={loadUsers}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {usersLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'customer' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'vendor' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive && !user.isBanned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isBanned ? 'Banned' : user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.isActive && !user.isBanned ? (
                          <button 
                            onClick={() => handleUserStatusUpdate(user._id, 'inactive')}
                            className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUserStatusUpdate(user._id, 'active')}
                            className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            Activate
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const ProductsTab = () => {
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);

    const loadProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await productsAPI.getProducts({ limit: 50 });
        setProducts(response.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to mock data
        setProducts([
          { _id: '1', name: 'Handmade Pearl Necklace', vendor: { name: 'Artisan Crafts Co.' }, category: 'Jewelry', price: 2999, stock: 15, approved: true, isActive: true },
          { _id: '2', name: 'Ceramic Vase', vendor: { name: 'Creative Home Studio' }, category: 'Home Decor', price: 2499, stock: 8, approved: true, isActive: true },
          { _id: '3', name: 'Wireless Headphones', vendor: { name: 'TechGear Pro' }, category: 'Electronics', price: 1999, stock: 25, approved: false, isActive: true },
          { _id: '4', name: 'Yoga Mat Premium', vendor: { name: 'FitLife Store' }, category: 'Sports', price: 3999, stock: 32, approved: false, isActive: true }
        ]);
      } finally {
        setProductsLoading(false);
      }
    };

    useEffect(() => {
      loadProducts();
    }, []);

    const handleProductApproval = async (productId, approved) => {
      try {
        await productsAPI.updateProduct(productId, { approved });
        setProducts(prev => prev.map(p => 
          p._id === productId ? { ...p, approved } : p
        ));
        alert(`Product ${approved ? 'approved' : 'unapproved'} successfully!`);
      } catch (error) {
        console.error('Error updating product approval:', error);
        alert('Failed to update product approval');
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
          <div className="flex space-x-2">
            <button onClick={() => openAddProductModal()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
            <button 
              onClick={loadProducts}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: {product._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.vendor?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleProductApproval(product._id, !product.approved)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            product.approved 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {product.approved ? 'Unapprove' : 'Approve'}
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  const SettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Platform Settings</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">General Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input
                type="text"
                defaultValue="SNAFLEShub"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value</label>
              <input
                type="number"
                defaultValue="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Public Key</label>
              <input
                type="text"
                defaultValue="pk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
              <input
                type="password"
                defaultValue="sk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Enable Stripe Payments</label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Platform Policies</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms of Service</label>
            <textarea
              rows={4}
              defaultValue="Platform terms and conditions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy</label>
            <textarea
              rows={4}
              defaultValue="Privacy policy content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          Save Settings
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'vendors', name: 'Vendors', icon: Store },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'vendors' && <VendorsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <SettingsTab />
            <AdminControls />
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Vendor</h2>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddVendor} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendor.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter vendor name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="email"
                      required
                      value={newVendor.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="vendor@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newVendor.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newVendor.banner}
                    onChange={(e) => handleInputChange('banner', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      value={newVendor.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={newVendor.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="url"
                      value={newVendor.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://vendor-website.com"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={newVendor.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of the vendor's business and products..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Jewelry', 'Clothing', 'Home Decor', 'Electronics', 'Beauty', 'Books', 'Sports', 'Art', 'Food'].map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newVendor.categories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('categories', [...newVendor.categories, category]);
                            } else {
                              handleInputChange('categories', newVendor.categories.filter(c => c !== category));
                            }
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => handleUserInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => handleUserInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => handleUserInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={newUser.password}
                      onChange={(e) => handleUserInputChange('password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={newUser.confirmPassword}
                      onChange={(e) => handleUserInputChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => handleUserInputChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newUser.status}
                      onChange={(e) => handleUserInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(v => ({ ...v, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(v => ({ ...v, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(v => ({ ...v, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter a detailed description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(v => ({ ...v, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {['Jewelry','Decor','Clothing','Accessories','Home','Art'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
                  <select
                    required
                    value={newProduct.vendor}
                    onChange={(e) => setNewProduct(v => ({ ...v, vendor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="" disabled>Select vendor</option>
                    {vendorOptions.map(v => (
                      <option key={v._id || v.id} value={v._id || v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(v => ({ ...v, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (comma or newline separated) *</label>
                  <textarea
                    required
                    value={newProduct.imagesInput}
                    onChange={(e) => setNewProduct(v => ({ ...v, imagesInput: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

