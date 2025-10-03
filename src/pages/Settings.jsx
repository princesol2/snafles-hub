import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  Globe, 
  CreditCard, 
  Heart, 
  Star, 
  MessageSquare,
  Settings as SettingsIcon,
  ArrowLeft,
  Check,
  AlertTriangle,
  Lock,
  Key,
  Smartphone,
  Camera,
  Save,
  Download,
  Trash2,
  Palette,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // Theme settings
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Account preferences
  const [preferences, setPreferences] = useState({
    emailDigest: 'weekly',
    searchHistory: true,
    recentlyViewed: true,
    recommendations: true,
    autoSave: true,
    darkMode: false,
    compactView: false,
    showTutorials: true
  });

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: 2, type: 'upi', upiId: 'user@paytm', isDefault: false },
    { id: 3, type: 'netbanking', bank: 'HDFC Bank', isDefault: false }
  ]);

  // Addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      name: 'Home',
      address: '123 Main Street, Apartment 4B',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Office',
      address: '456 Business Park, Floor 2',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
      phone: '+91 98765 43211',
      isDefault: false
    }
  ]);

  const tabs = [
    { id: 'account', name: 'Account', icon: User, description: 'Profile and basic settings' },
    { id: 'security', name: 'Security', icon: Shield, description: 'Password and authentication' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Email and push notifications' },
    { id: 'privacy', name: 'Privacy', icon: Eye, description: 'Data and privacy controls' },
    { id: 'preferences', name: 'Preferences', icon: SettingsIcon, description: 'Appearance and behavior' },
    { id: 'payment', name: 'Payment', icon: CreditCard, description: 'Payment methods and billing' },
    { id: 'addresses', name: 'Addresses', icon: Globe, description: 'Shipping and billing addresses' }
  ];

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success('Preference updated');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    toast.success('Language preference updated');
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    toast.success('Currency preference updated');
  };

  const handleAddPaymentMethod = () => {
    toast.success('Add payment method functionality would open here');
  };

  const handleAddAddress = () => {
    toast.success('Add address functionality would open here');
  };

  const handleDeletePaymentMethod = (id) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    toast.success('Payment method removed');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(address => address.id !== id));
    toast.success('Address removed');
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast.success('Default payment method updated');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(prev => prev.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    toast.success('Default address updated');
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
            <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
                <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-start space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mt-0.5" />
                      <div>
                        <div className="font-medium">{tab.name}</div>
                        <div className="text-xs text-gray-500">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
                
                      <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                        <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                        <p className="text-sm text-gray-500">Update your personal information and profile picture</p>
                            </div>
                            </div>
                    <button
                      onClick={() => navigate('/profile-settings')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Manage
                    </button>
                        </div>
                        
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                        <h3 className="font-semibold text-gray-900">Email Verification</h3>
                        <p className="text-sm text-gray-500">Your email address is verified</p>
                            </div>
                          </div>
                    <span className="text-sm text-green-600 font-semibold">Verified</span>
                          </div>
                          
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                        <h3 className="font-semibold text-gray-900">Account Created</h3>
                        <p className="text-sm text-gray-500">Member since {new Date().toLocaleDateString()}</p>
                          </div>
                          </div>
                    <span className="text-sm text-gray-500">Active</span>
                        </div>
                        </div>
                  </div>
                )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                    <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Lock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                          <h3 className="font-semibold text-gray-900">Password</h3>
                          <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                            </div>
                          </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Change
                      </button>
                            </div>

                    <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="h-6 w-6 text-green-600" />
                          </div>
                            <div>
                          <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                          </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-orange-600" />
                              </div>
                              <div>
                          <h3 className="font-semibold text-gray-900">Active Sessions</h3>
                          <p className="text-sm text-gray-500">Manage your active login sessions</p>
                              </div>
                              </div>
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                        Manage
                            </button>
                          </div>
                                    </div>
                                  </div>
                                    </div>
                                  )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                      {[
                        { key: 'emailDigest', label: 'Email digest frequency', options: [
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'never', label: 'Never' }
                        ]}
                      ].map((item) => (
                        <div key={item.key} className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">{item.label}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {item.options.map((option) => (
                              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={item.key}
                                  value={option.value}
                                  checked={preferences[item.key] === option.value}
                                  onChange={(e) => handlePreferenceChange(item.key, e.target.value)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{option.label}</span>
                              </label>
                            ))}
                          </div>
                          </div>
                      ))}
                        </div>
                      </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">App Notifications</h3>
                        <div className="space-y-4">
                      {[
                        { key: 'searchHistory', label: 'Search history', description: 'Save your search history for better recommendations' },
                        { key: 'recentlyViewed', label: 'Recently viewed', description: 'Keep track of recently viewed products' },
                        { key: 'recommendations', label: 'Product recommendations', description: 'Get personalized product recommendations' },
                        { key: 'autoSave', label: 'Auto-save preferences', description: 'Automatically save your preferences' },
                        { key: 'showTutorials', label: 'Show tutorials', description: 'Display helpful tutorials and tips' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                              checked={preferences[item.key]}
                              onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                      ))}
                              </div>
                      </div>
                    </div>
                  </div>
                )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Data</h2>
                    
                    <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Download className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                        <h3 className="font-semibold text-gray-900">Download Your Data</h3>
                        <p className="text-sm text-gray-500">Get a copy of all your personal data</p>
                              </div>
                            </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Download
                            </button>
                          </div>
                          
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Eye className="h-6 w-6 text-orange-600" />
                              </div>
                              <div>
                        <h3 className="font-semibold text-gray-900">Privacy Settings</h3>
                        <p className="text-sm text-gray-500">Control who can see your information</p>
                              </div>
                            </div>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      Manage
                            </button>
                          </div>
                          
                  <div className="flex items-center justify-between p-6 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="h-6 w-6 text-red-600" />
                              </div>
                              <div>
                        <h3 className="font-semibold text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                              </div>
                            </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Delete
                            </button>
                          </div>
                        </div>
                      </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">App Preferences</h2>
                
                <div className="space-y-6">
                  {/* Theme Settings */}
                          <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Theme</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                            { value: 'auto', label: 'Auto', icon: Monitor }
                          ].map((option) => {
                            const Icon = option.icon;
                            return (
                              <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                                  type="radio"
                                  name="theme"
                                  value={option.value}
                                  checked={theme === option.value}
                                  onChange={(e) => handleThemeChange(e.target.value)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <Icon className="h-4 w-4 text-gray-600" />
                                <span className="text-sm text-gray-700">{option.label}</span>
                              </label>
                            );
                          })}
                          </div>
                        </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Language</h4>
                        <select
                          value={language}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Currency</h4>
                        <select
                          value={currency}
                          onChange={(e) => handleCurrencyChange(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Timezone</h4>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                            </div>
                    </div>
                          </div>
                          
                  {/* Display Preferences */}
                            <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Display</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'compactView', label: 'Compact view', description: 'Use a more compact layout to fit more content' },
                        { key: 'darkMode', label: 'Dark mode', description: 'Use dark theme for better viewing in low light' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                              checked={preferences[item.key]}
                              onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                      ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                  <button
                    onClick={handleAddPaymentMethod}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Method
                  </button>
                </div>
                
                          <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                          <h3 className="font-semibold text-gray-900">
                            {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : 
                             method.type === 'upi' ? `UPI • ${method.upiId}` :
                             `Net Banking • ${method.bank}`}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {method.type === 'card' ? `Expires ${method.expiry}` : 
                             method.type === 'upi' ? 'UPI Payment' : 'Net Banking'}
                            {method.isDefault && ' • Default'}
                          </p>
                            </div>
                          </div>
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefaultPayment(method.id)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            Set Default
                                </button>
                        )}
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Remove
                                </button>
                            </div>
                          </div>
                  ))}
                        </div>
                      </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
                  <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Address
                  </button>
                          </div>
                          
                          <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start justify-between p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Globe className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                          <h3 className="font-semibold text-gray-900">{address.name}</h3>
                          <p className="text-sm text-gray-600">{address.address}</p>
                          <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                          <p className="text-sm text-gray-500">Phone: {address.phone}</p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Default
                            </span>
                          )}
                            </div>
                          </div>
                      <div className="flex items-center space-x-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            Set Default
                          </button>
                        )}
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Remove
                            </button>
                          </div>
                      </div>
                  ))}
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;