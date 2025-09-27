import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Save, Eye, EyeOff, CreditCard, Shield, Trash2, Smartphone, Mail, Bell, Globe, Key, AlertTriangle } from 'lucide-react';
import PaymentMethodManager from '../components/payment/PaymentMethodManager';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate API call for account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call the backend to delete the account
      toast.success('Account deleted successfully. You will be logged out.');
      
      // Logout user and redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      // Simulate API call for 2FA toggle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(twoFactorEnabled ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled');
    } catch (error) {
      toast.error('Failed to update two-factor authentication settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return false;
    }

    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }

    // If changing password, validate password fields
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to change password' });
        return false;
      }

      if (!formData.newPassword) {
        setMessage({ type: 'error', text: 'New password is required' });
        return false;
      }

      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call for updating profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user context with new data
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email
      };

      updateUser(updatedUser);

      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });

      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 text-gray-400">
              Manage your account information and security settings
            </p>
          </div>

            {/* Tab Navigation */}
            <div className="bg-white bg-gray-800 rounded-2xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200 border-gray-700 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'text-navy-600 border-b-2 border-navy-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User className="h-5 w-5 mx-auto mb-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`flex-1 py-4 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'payments'
                      ? 'text-navy-600 border-b-2 border-navy-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mx-auto mb-2" />
                  Payments
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-4 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'security'
                      ? 'text-navy-600 border-b-2 border-navy-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Shield className="h-5 w-5 mx-auto mb-2" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 py-4 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'notifications'
                      ? 'text-navy-600 border-b-2 border-navy-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Bell className="h-5 w-5 mx-auto mb-2" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`flex-1 py-4 px-4 text-center font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'danger'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5 mx-auto mb-2" />
                  Danger Zone
                </button>
              </div>
            </div>

          {/* Profile Form */}
          {activeTab === 'profile' && (
            <div className="bg-white bg-gray-800 rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </h2>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200 border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Change Password
                </h2>
                <p className="text-sm text-gray-600 text-gray-400">
                  Leave password fields empty if you don't want to change your password
                </p>

                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="input w-full pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="input w-full pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input w-full pr-12"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Display */}
              {message.text && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payments' && (
            <div className="bg-white bg-gray-800 rounded-2xl shadow-lg p-8">
              <PaymentMethodManager />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 text-white mb-6 flex items-center">
                <Shield className="h-6 w-6 mr-3 text-navy-600" />
                Security Settings
              </h2>

              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="border border-gray-200 border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-6 w-6 text-navy-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggle2FA}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        twoFactorEnabled
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {/* Password Change */}
                <div className="border border-gray-200 border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 text-white mb-4 flex items-center">
                    <Key className="h-5 w-5 mr-2 text-navy-600" />
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600 text-gray-400 mb-4">
                    Update your password to keep your account secure
                  </p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="btn btn-outline"
                  >
                    Change Password
                  </button>
                </div>

                {/* Login History */}
                <div className="border border-gray-200 border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 text-white mb-4 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-navy-600" />
                    Recent Login Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-white">Current Session</p>
                        <p className="text-sm text-gray-600 text-gray-400">Chrome on Windows • Mumbai, India</p>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-white">Previous Session</p>
                        <p className="text-sm text-gray-600 text-gray-400">Mobile App • 2 hours ago</p>
                      </div>
                      <span className="text-sm text-gray-500">Ended</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 text-white mb-6 flex items-center">
                <Bell className="h-6 w-6 mr-3 text-navy-600" />
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 border-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-navy-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-600 text-gray-400">Order updates, promotions, and account alerts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 peer-focus:ring-navy-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-navy-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 border-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-navy-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-white">SMS Notifications</h3>
                        <p className="text-sm text-gray-600 text-gray-400">Order confirmations and delivery updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 peer-focus:ring-navy-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-navy-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 border-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-navy-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-white">Push Notifications</h3>
                        <p className="text-sm text-gray-600 text-gray-400">Real-time updates and reminders</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 peer-focus:ring-navy-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-navy-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 border-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-navy-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-white">Marketing Emails</h3>
                        <p className="text-sm text-gray-600 text-gray-400">Promotions, new products, and special offers</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.marketing}
                        onChange={() => handleNotificationChange('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 peer-focus:ring-navy-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-navy-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="bg-white bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3" />
                Danger Zone
              </h2>

              <div className="space-y-6">
                <div className="border border-red-200 border-red-800 rounded-xl p-6 bg-red-50 bg-red-900/20">
                  <h3 className="text-lg font-semibold text-red-800 text-red-200 mb-2 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700 text-red-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain. This action will:
                  </p>
                  <ul className="text-sm text-red-700 text-red-300 mb-4 space-y-1">
                    <li>• Permanently delete your profile and all personal data</li>
                    <li>• Cancel all pending orders and negotiations</li>
                    <li>• Remove all reviews and ratings you've submitted</li>
                    <li>• Delete your wishlist and saved preferences</li>
                  </ul>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 text-white">Delete Account</h3>
                    <p className="text-sm text-gray-600 text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-gray-300 mb-6">
                  Are you absolutely sure you want to delete your account? This will permanently remove all your data and cannot be reversed.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 btn btn-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 text-blue-200 mb-2">
              🔒 Security Notice
            </h3>
            <p className="text-sm text-blue-700 text-blue-300">
              Your password is encrypted and never stored in plain text. We use industry-standard 
              security practices to protect your account information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
