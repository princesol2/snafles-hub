import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);


  // Password reset options
  const [passwordResetMethod, setPasswordResetMethod] = useState('email');

  // Journal settings
  const [journalData, setJournalData] = useState({
    addresses: [],
    notes: '',
    preferences: {
      defaultShippingAddress: '',
      defaultBillingAddress: '',
      newsletter: true,
      smsUpdates: false
    }
  });
  const [isEditingJournal, setIsEditingJournal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      
      // Load journal data from localStorage
      const savedJournalData = localStorage.getItem('journalData');
      if (savedJournalData) {
        setJournalData(JSON.parse(savedJournalData));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage({ type: 'error', text: 'Failed to load user data' });
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate password if changing email or phone
      if (profileData.currentPassword && (profileData.email !== user.email || profileData.phone !== user.phone)) {
        // Verify current password
        const isValid = await authAPI.verifyPassword(profileData.currentPassword);
        if (!isValid) {
          setMessage({ type: 'error', text: 'Current password is incorrect' });
          setSaving(false);
          return;
        }
      }

      // Update profile
      const updatedUser = await authAPI.updateProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      });

      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    if (profileData.newPassword !== profileData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setSaving(false);
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };


  const handlePasswordReset = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let resetData = {};
      
      switch (passwordResetMethod) {
        case 'email':
          resetData = { email: user.email };
          break;
        case 'phone':
          resetData = { phone: user.phone };
          break;
        case 'snaflesId':
          resetData = { snaflesId: user.id };
          break;
      }

      await authAPI.requestPasswordReset(resetData);
      setMessage({ 
        type: 'success', 
        text: `Password reset instructions sent to your ${passwordResetMethod === 'snaflesId' ? 'Snafles account' : passwordResetMethod}!` 
      });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setMessage({ type: 'error', text: 'Failed to send password reset instructions' });
    } finally {
      setSaving(false);
    }
  };

  const getMembershipDuration = () => {
    if (!user?.createdAt) return 'Unknown';
    
    const joinDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  // Journal functions
  const handleJournalUpdate = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Save journal data to localStorage
      localStorage.setItem('journalData', JSON.stringify(journalData));
      setMessage({ type: 'success', text: 'Journal updated successfully!' });
      setIsEditingJournal(false);
    } catch (error) {
      console.error('Error updating journal:', error);
      setMessage({ type: 'error', text: 'Failed to update journal' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city) {
      setMessage({ type: 'error', text: 'Please fill in all required address fields' });
      return;
    }

    const address = {
      ...newAddress,
      id: Date.now().toString()
    };

    setJournalData(prev => ({
      ...prev,
      addresses: [...prev.addresses, address]
    }));

    // Reset form
    setNewAddress({
      type: 'shipping',
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      isDefault: false
    });

    setMessage({ type: 'success', text: 'Address added successfully!' });
  };

  const handleDeleteAddress = (addressId) => {
    setJournalData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== addressId)
    }));
    setMessage({ type: 'success', text: 'Address deleted successfully!' });
  };

  const handleSetDefaultAddress = (addressId, type) => {
    setJournalData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [`default${type.charAt(0).toUpperCase() + type.slice(1)}Address`]: addressId
      }
    }));
    setMessage({ type: 'success', text: `Default ${type} address updated!` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'journal', label: 'Journal', icon: '📝' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'payment', label: 'Payment Settings', icon: '💳' },
    { id: 'contact', label: 'Contact Us', icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and personal information</p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="card p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="btn btn-outline"
                      >
                        {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>
                    
                    {!isEditingProfile ? (
                      // Display current profile details
                      <div className="space-y-6">
                        <div className="card-premium p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Full Name
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                {user?.name || 'Not provided'}
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Email Address
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                {user?.email || 'Not provided'}
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Phone Number
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                {user?.phone ? 
                                  `${user.phone.slice(0, 3)}***${user.phone.slice(-4)}` : 
                                  'Not provided'
                                }
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Account Type
                              </label>
                              <p className="text-lg font-semibold text-gray-900 capitalize">
                                {user?.role || 'Customer'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card-premium p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account History</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Member Since
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Last Login
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Edit profile form
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                              className="input w-full"
                              placeholder="Enter your full name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              className="input w-full"
                              placeholder="Enter your email"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                              className="input w-full"
                              placeholder="Enter your phone number"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={profileData.currentPassword}
                              onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="input w-full"
                              placeholder="Enter current password to verify changes"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Required when changing email or phone
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="btn btn-outline px-8"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary px-8"
                          >
                            {saving ? 'Saving...' : 'Update Profile'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}


                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Email Notifications
                              </label>
                              <p className="text-xs text-gray-500">
                                Receive updates via email
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                SMS Notifications
                              </label>
                              <p className="text-xs text-gray-500">
                                Receive updates via text message
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Push Notifications
                              </label>
                              <p className="text-xs text-gray-500">
                                Receive browser notifications
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Marketing Communications
                              </label>
                              <p className="text-xs text-gray-500">
                                Receive promotional offers and updates
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Journal Tab */}
                {activeTab === 'journal' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Personal Journal</h2>
                      <button
                        onClick={() => setIsEditingJournal(!isEditingJournal)}
                        className="btn btn-outline"
                      >
                        {isEditingJournal ? 'Cancel' : 'Edit Journal'}
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Address Book Section */}
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Book</h3>
                        
                        {/* Add New Address Form */}
                        {isEditingJournal && (
                          <div className="bg-gray-50 p-4 rounded-xl mb-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Add New Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                <select
                                  value={newAddress.type}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                                  className="input w-full"
                                >
                                  <option value="shipping">Shipping</option>
                                  <option value="billing">Billing</option>
                                  <option value="both">Both</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                  type="text"
                                  value={newAddress.name}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                                  className="input w-full"
                                  placeholder="Enter full name"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                                <input
                                  type="text"
                                  value={newAddress.street}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                                  className="input w-full"
                                  placeholder="Enter street address"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <input
                                  type="text"
                                  value={newAddress.city}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                                  className="input w-full"
                                  placeholder="Enter city"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                                <input
                                  type="text"
                                  value={newAddress.state}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                                  className="input w-full"
                                  placeholder="Enter state/province"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                                <input
                                  type="text"
                                  value={newAddress.zipCode}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                                  className="input w-full"
                                  placeholder="Enter ZIP/postal code"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                  type="text"
                                  value={newAddress.country}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                                  className="input w-full"
                                  placeholder="Enter country"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                  type="tel"
                                  value={newAddress.phone}
                                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                                  className="input w-full"
                                  placeholder="Enter phone number"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={newAddress.isDefault}
                                    onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-gray-700">Set as default {newAddress.type} address</span>
                                </label>
                              </div>
                            </div>
                            <button
                              onClick={handleAddAddress}
                              className="btn btn-primary mt-4"
                            >
                              Add Address
                            </button>
                          </div>
                        )}

                        {/* Address List */}
                        <div className="space-y-4">
                          {journalData.addresses.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No addresses saved yet. Add your first address above.</p>
                          ) : (
                            journalData.addresses.map((address) => (
                              <div key={address.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {address.type}
                                      </span>
                                      {journalData.preferences.defaultShippingAddress === address.id && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                          Default Shipping
                                        </span>
                                      )}
                                      {journalData.preferences.defaultBillingAddress === address.id && (
                                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                          Default Billing
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="font-semibold text-gray-900">{address.name}</h4>
                                    <p className="text-gray-600">
                                      {address.street}<br />
                                      {address.city}, {address.state} {address.zipCode}<br />
                                      {address.country}
                                    </p>
                                    {address.phone && (
                                      <p className="text-gray-500 text-sm mt-1">📞 {address.phone}</p>
                                    )}
                                  </div>
                                  {isEditingJournal && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSetDefaultAddress(address.id, 'shipping')}
                                        className="btn btn-sm btn-outline"
                                        title="Set as default shipping"
                                      >
                                        📦
                                      </button>
                                      <button
                                        onClick={() => handleSetDefaultAddress(address.id, 'billing')}
                                        className="btn btn-sm btn-outline"
                                        title="Set as default billing"
                                      >
                                        💳
                                      </button>
                                      <button
                                        onClick={() => handleDeleteAddress(address.id)}
                                        className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                                        title="Delete address"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Personal Notes Section */}
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Notes</h3>
                        {isEditingJournal ? (
                          <textarea
                            value={journalData.notes}
                            onChange={(e) => setJournalData(prev => ({ ...prev, notes: e.target.value }))}
                            className="input w-full h-32"
                            placeholder="Add your personal notes, reminders, or any other information you'd like to keep track of..."
                          />
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-xl">
                            {journalData.notes ? (
                              <p className="text-gray-700 whitespace-pre-wrap">{journalData.notes}</p>
                            ) : (
                              <p className="text-gray-500 italic">No notes added yet. Click "Edit Journal" to add personal notes.</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Preferences Section */}
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={journalData.preferences.newsletter}
                              onChange={(e) => setJournalData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, newsletter: e.target.checked }
                              }))}
                              className="mr-3"
                              disabled={!isEditingJournal}
                            />
                            <span className="text-gray-700">Subscribe to newsletter and updates</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={journalData.preferences.smsUpdates}
                              onChange={(e) => setJournalData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, smsUpdates: e.target.checked }
                              }))}
                              className="mr-3"
                              disabled={!isEditingJournal}
                            />
                            <span className="text-gray-700">Receive SMS updates for orders</span>
                          </label>
                        </div>
                      </div>

                      {/* Save Button */}
                      {isEditingJournal && (
                        <div className="flex justify-end">
                          <button
                            onClick={handleJournalUpdate}
                            disabled={saving}
                            className="btn btn-primary"
                          >
                            {saving ? 'Saving...' : 'Save Journal'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    
                    <div className="space-y-8">
                      {/* Password Change */}
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                        
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={profileData.currentPassword}
                              onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="input w-full max-w-md"
                              placeholder="Enter current password"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                value={profileData.newPassword}
                                onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="input w-full"
                                placeholder="Enter new password"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={profileData.confirmPassword}
                                onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="input w-full"
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={saving}
                              className="btn btn-primary px-6"
                            >
                              {saving ? 'Updating...' : 'Update Password'}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Password Reset */}
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Reset</h3>
                        
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Choose how you'd like to receive password reset instructions:
                          </p>
                          
                          <div className="space-y-3">
                            {[
                              { value: 'email', label: 'Email Address', desc: user?.email },
                              { value: 'phone', label: 'Phone Number', desc: user?.phone },
                              { value: 'snaflesId', label: 'Snafles ID', desc: user?.id }
                            ].map((option) => (
                              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="resetMethod"
                                  value={option.value}
                                  checked={passwordResetMethod === option.value}
                                  onChange={(e) => setPasswordResetMethod(e.target.value)}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                  <p className="text-xs text-gray-500">{option.desc}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              onClick={handlePasswordReset}
                              disabled={saving}
                              className="btn btn-outline px-6"
                            >
                              {saving ? 'Sending...' : 'Send Reset Instructions'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Two-Step Verification */}
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Step Verification</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Enable Two-Step Verification</p>
                              <p className="text-xs text-gray-500">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked={false}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Setup Methods:</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-blue-600">📱</span>
                                <span className="text-sm text-blue-800">SMS to {user?.phone || 'your phone number'}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-blue-600">📧</span>
                                <span className="text-sm text-blue-800">Email to {user?.email || 'your email address'}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-blue-600">🔐</span>
                                <span className="text-sm text-blue-800">Authenticator app (Google Authenticator, Authy)</span>
                              </div>
                            </div>
                          </div>
                          
                          <button className="btn btn-outline">
                            Configure Two-Step Verification
                          </button>
                        </div>
                      </div>

                      {/* Account Deletion */}
                      <div className="card-premium p-6 border-red-200 bg-red-50">
                        <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-red-100 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-red-900 mb-2">Delete Account</h4>
                            <p className="text-sm text-red-700 mb-4">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-red-900 mb-2">
                                  Enter your password to confirm
                                </label>
                                <input
                                  type="password"
                                  className="input w-full max-w-md border-red-300 focus:border-red-500 focus:ring-red-500"
                                  placeholder="Enter your password"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-red-900 mb-2">
                                  Type "DELETE" to confirm
                                </label>
                                <input
                                  type="text"
                                  className="input w-full max-w-md border-red-300 focus:border-red-500 focus:ring-red-500"
                                  placeholder="Type DELETE to confirm"
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end mt-4">
                              <button className="btn bg-red-600 hover:bg-red-700 text-white px-6">
                                Delete Account
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Settings Tab */}
                {activeTab === 'payment' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">💳</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Credit Card</p>
                                <p className="text-sm text-gray-500">**** **** **** 1234</p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Edit
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 font-semibold">🏦</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Bank Account</p>
                                <p className="text-sm text-gray-500">**** 5678</p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Edit
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                <span className="text-pink-600 font-semibold">📱</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">UPI</p>
                                <p className="text-sm text-gray-500">user@paytm</p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Edit
                            </button>
                          </div>
                        </div>
                        
                        <button className="w-full mt-4 btn btn-outline">
                          + Add New Payment Method
                        </button>
                      </div>
                      
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Billing Address
                            </label>
                            <textarea
                              rows={3}
                              className="input w-full"
                              placeholder="Enter your billing address"
                            ></textarea>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tax ID (Optional)
                            </label>
                            <input
                              type="text"
                              className="input w-full"
                              placeholder="Enter your tax ID"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Auto-save payment methods
                              </label>
                              <p className="text-xs text-gray-500">
                                Automatically save new payment methods for future use
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Email receipts
                              </label>
                              <p className="text-xs text-gray-500">
                                Send email receipts for all transactions
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Us Tab */}
                {activeTab === 'contact' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
                    
                    <div className="space-y-6">
                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Help & Support</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                📧 Email Support
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <a href="mailto:support@snafles.com" className="text-blue-600 hover:text-blue-700">
                                  support@snafles.com
                                </a>
                              </p>
                              <p className="text-sm text-gray-500">24/7 email support</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                📞 Phone Support
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <a href="tel:+1-800-SNAFLES" className="text-blue-600 hover:text-blue-700">
                                  +1 (800) SNAFLES
                                </a>
                              </p>
                              <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                💬 Live Chat
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <button className="text-blue-600 hover:text-blue-700 underline">
                                  Start Live Chat
                                </button>
                              </p>
                              <p className="text-sm text-gray-500">Available 24/7</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                📋 Help Center
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <button className="text-blue-600 hover:text-blue-700 underline">
                                  Browse Help Articles
                                </button>
                              </p>
                              <p className="text-sm text-gray-500">FAQs and guides</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vendor Support Section */}
                      <div className="card-premium p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏪 Vendor Support</h3>
                        <p className="text-gray-600 mb-4">Specialized support for vendors and sellers on our platform</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                📧 Vendor Email Support
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <a href="mailto:vendors@snafles.com" className="text-orange-600 hover:text-orange-700">
                                  vendors@snafles.com
                                </a>
                              </p>
                              <p className="text-sm text-gray-500">Dedicated vendor support team</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                📞 Vendor Hotline
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <a href="tel:+1-800-VENDORS" className="text-orange-600 hover:text-orange-700">
                                  +1 (800) VENDORS
                                </a>
                              </p>
                              <p className="text-sm text-gray-500">Mon-Fri 8AM-8PM EST</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                🎯 Vendor Success Manager
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <a href="mailto:success@snafles.com" className="text-orange-600 hover:text-orange-700">
                                  success@snafles.com
                                </a>
                              </p>
                              <p className="text-sm text-gray-500">Growth and optimization support</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                📚 Vendor Resources
                              </label>
                              <p className="text-lg font-semibold text-gray-900">
                                <button className="text-orange-600 hover:text-orange-700 underline">
                                  Vendor Help Center
                                </button>
                              </p>
                              <p className="text-sm text-gray-500">Guides, tutorials, and best practices</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Vendor Support Topics:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <span>• Account Setup & Verification</span>
                            <span>• Product Listing & Management</span>
                            <span>• Order Processing & Fulfillment</span>
                            <span>• Payment & Payout Issues</span>
                            <span>• Analytics & Performance</span>
                            <span>• Marketing & Promotion Tools</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact Form</h3>
                        
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                              </label>
                              <select className="input w-full">
                                <option>General Inquiry</option>
                                <option>Technical Support</option>
                                <option>Account Issues</option>
                                <option>Payment Problems</option>
                                <option>Feature Request</option>
                                <option>Bug Report</option>
                                <option>Vendor Support</option>
                                <option>Vendor Onboarding</option>
                                <option>Vendor Payment Issues</option>
                                <option>Product Listing Help</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                              </label>
                              <select className="input w-full">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Urgent</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Message
                            </label>
                            <textarea 
                              rows={4}
                              className="input w-full"
                              placeholder="Describe your issue or question..."
                            ></textarea>
                          </div>
                          
                          <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary px-8">
                              Send Message
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="card-premium p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account Info</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Member Since
                            </label>
                            <p className="text-lg font-semibold text-gray-900">
                              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Account Type
                            </label>
                            <p className="text-lg font-semibold text-gray-900 capitalize">
                              {user?.role || 'Customer'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
