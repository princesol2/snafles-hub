import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const AutoRepayment = ({ onClose }) => {
  const { user } = useAuth();
  const [repaymentSettings, setRepaymentSettings] = useState({
    autoRepay: false,
    maxAmount: 0,
    preferredMethod: 'card',
    notificationDays: 3
  });
  const [pendingRepayments, setPendingRepayments] = useState([]);
  const [repaymentHistory, setRepaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRepaymentData();
  }, []);

  const fetchRepaymentData = async () => {
    try {
      const [settingsResponse, pendingResponse, historyResponse] = await Promise.all([
        api.get('/repayment/settings'),
        api.get('/repayment/pending'),
        api.get('/repayment/history')
      ]);
      
      setRepaymentSettings(settingsResponse.data);
      setPendingRepayments(pendingResponse.data);
      setRepaymentHistory(historyResponse.data);
    } catch (error) {
      console.error('Error fetching repayment data:', error);
    }
  };

  const updateSettings = async () => {
    setLoading(true);
    try {
      await api.put('/repayment/settings', repaymentSettings);
      toast.success('Repayment settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const processRepayment = async (repaymentId) => {
    setLoading(true);
    try {
      await api.post(`/repayment/process/${repaymentId}`);
      fetchRepaymentData();
      toast.success('Repayment processed successfully');
    } catch (error) {
      console.error('Error processing repayment:', error);
      toast.error('Failed to process repayment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">🛡️ Automatic Repayment System</h3>
            <p className="text-sm text-gray-600">Secure and automated repayment protection</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Settings */}
          <div className="w-80 p-4 border-r">
            <h4 className="font-semibold mb-4">Repayment Settings</h4>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={repaymentSettings.autoRepay}
                    onChange={(e) => setRepaymentSettings(prev => ({
                      ...prev,
                      autoRepay: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Enable Auto-Repayment</span>
                </label>
                <div className="text-xs text-gray-500 mt-1">
                  Automatically repay loans on due date
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Auto-Repay Amount
                </label>
                <input
                  type="number"
                  value={repaymentSettings.maxAmount}
                  onChange={(e) => setRepaymentSettings(prev => ({
                    ...prev,
                    maxAmount: parseFloat(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Payment Method
                </label>
                <select
                  value={repaymentSettings.preferredMethod}
                  onChange={(e) => setRepaymentSettings(prev => ({
                    ...prev,
                    preferredMethod: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Digital Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Days Before Due
                </label>
                <input
                  type="number"
                  value={repaymentSettings.notificationDays}
                  onChange={(e) => setRepaymentSettings(prev => ({
                    ...prev,
                    notificationDays: parseInt(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="7"
                />
              </div>

              <button
                onClick={updateSettings}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Settings'}
              </button>
            </div>

            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>🔒 Security:</strong> All repayments are encrypted and processed through secure payment gateways. 
                Your financial information is never stored on our servers.
              </div>
            </div>
          </div>

          {/* Pending Repayments */}
          <div className="flex-1 p-4 border-r">
            <h4 className="font-semibold mb-4">Pending Repayments</h4>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingRepayments.map((repayment) => (
                <div key={repayment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{formatCurrency(repayment.amount)}</div>
                      <div className="text-sm text-gray-600">
                        Due: {formatDate(repayment.dueDate)}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(repayment.status)}`}>
                      {repayment.status}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    To: {repayment.helperName} • Product: {repayment.productName}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => processRepayment(repayment.id)}
                      disabled={loading}
                      className="flex-1 bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600 disabled:bg-gray-300"
                    >
                      Pay Now
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repayment History */}
          <div className="w-80 p-4">
            <h4 className="font-semibold mb-4">Repayment History</h4>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {repaymentHistory.map((repayment) => (
                <div key={repayment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{formatCurrency(repayment.amount)}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(repayment.paidDate)}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(repayment.status)}`}>
                      {repayment.status}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    To: {repayment.helperName} • Method: {repayment.paymentMethod}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoRepayment;
