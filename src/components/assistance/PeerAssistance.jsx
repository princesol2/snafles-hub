import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const PeerAssistance = ({ product, onClose }) => {
  const { user } = useAuth();
  const [assistanceRequests, setAssistanceRequests] = useState([]);
  const [availableHelpers, setAvailableHelpers] = useState([]);
  const [requestAmount, setRequestAmount] = useState('');
  const [repaymentDate, setRepaymentDate] = useState('');
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    fetchAvailableHelpers();
    fetchAssistanceRequests();
  }, []);

  const fetchAvailableHelpers = async () => {
    try {
      const response = await api.get('/assistance/available-helpers');
      setAvailableHelpers(response.data);
    } catch (error) {
      console.error('Error fetching helpers:', error);
    }
  };

  const fetchAssistanceRequests = async () => {
    try {
      const response = await api.get('/assistance/requests');
      setAssistanceRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const requestAssistance = async () => {
    if (!requestAmount || !repaymentDate || !selectedHelper) return;

    setIsRequesting(true);
    try {
      await api.post('/assistance/request', {
        productId: product?.id,
        amount: parseFloat(requestAmount),
        repaymentDate: repaymentDate,
        helperId: selectedHelper.id,
        message: `Need assistance to purchase ${product?.name}`
      });
      
      setRequestAmount('');
      setRepaymentDate('');
      setSelectedHelper(null);
      fetchAssistanceRequests();
    } catch (error) {
      console.error('Error requesting assistance:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const provideAssistance = async (requestId) => {
    try {
      await api.post(`/assistance/provide/${requestId}`);
      fetchAssistanceRequests();
      fetchAvailableHelpers();
    } catch (error) {
      console.error('Error providing assistance:', error);
    }
  };

  const getHelperRating = (helper) => {
    return (helper.assistanceCount > 0 ? helper.rating : 5.0).toFixed(1);
  };

  const getHelperBadge = (helper) => {
    if (helper.assistanceCount >= 50) return { text: 'Super Helper', color: 'bg-purple-100 text-purple-800' };
    if (helper.assistanceCount >= 20) return { text: 'Trusted Helper', color: 'bg-blue-100 text-blue-800' };
    if (helper.assistanceCount >= 5) return { text: 'Helper', color: 'bg-green-100 text-green-800' };
    return { text: 'New Helper', color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">🤝 Peer Assistance Network</h3>
            <p className="text-sm text-gray-600">Get help from the community to complete your purchase</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Request Assistance */}
          <div className="flex-1 p-4 border-r">
            <h4 className="font-semibold mb-4">Request Assistance</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Needed
                </label>
                <input
                  type="number"
                  placeholder="Enter amount needed"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repayment Date
                </label>
                <input
                  type="date"
                  value={repaymentDate}
                  onChange={(e) => setRepaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Helper
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableHelpers.map((helper) => (
                    <div
                      key={helper.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedHelper?.id === helper.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedHelper(helper)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{helper.name}</div>
                          <div className="text-sm text-gray-600">
                            ⭐ {getHelperRating(helper)} • {helper.assistanceCount} assists
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHelperBadge(helper).color}`}>
                          {getHelperBadge(helper).text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={requestAssistance}
                disabled={isRequesting || !requestAmount || !repaymentDate || !selectedHelper}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isRequesting ? 'Requesting...' : 'Request Assistance'}
              </button>
            </div>
          </div>

          {/* Available Requests */}
          <div className="flex-1 p-4">
            <h4 className="font-semibold mb-4">Help Others</h4>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {assistanceRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">${request.amount}</div>
                      <div className="text-sm text-gray-600">
                        Repay by: {formatDate(request.repaymentDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{request.requester.name}</div>
                      <div className="text-xs text-gray-500">
                        ⭐ {request.requester.rating?.toFixed(1) || 'New'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {request.message}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => provideAssistance(request.id)}
                      className="flex-1 bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                    >
                      Help Now
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>🛡️ Protection:</strong> All assistance is protected by our automatic repayment system. 
                If the borrower doesn't repay on time, we'll handle it automatically.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerAssistance;
