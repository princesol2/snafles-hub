import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const LiveBidding = ({ product, onClose }) => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [currentBid, setCurrentBid] = useState(product?.price || 0);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isBidding, setIsBidding] = useState(false);
  const [autoBid, setAutoBid] = useState(false);
  const [maxBid, setMaxBid] = useState('');

  useEffect(() => {
    fetchBids();
    const interval = setInterval(fetchBids, 1000);
    return () => clearInterval(interval);
  }, [product?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endBidding();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bidding/bids/${product?.id}`);
      setBids(response.data);
      if (response.data.length > 0) {
        const highestBid = Math.max(...response.data.map(bid => bid.amount));
        setCurrentBid(highestBid);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const placeBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= currentBid) return;

    setIsBidding(true);
    try {
      await api.post('/bidding/place-bid', {
        productId: product.id,
        amount: parseFloat(bidAmount),
        autoBid: autoBid,
        maxBid: autoBid ? parseFloat(maxBid) : null
      });
      
      setBidAmount('');
      fetchBids();
    } catch (error) {
      console.error('Error placing bid:', error);
    } finally {
      setIsBidding(false);
    }
  };

  const endBidding = () => {
    // Handle bidding end logic
    console.log('Bidding ended!');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBidStatus = (bid) => {
    if (bid.amount === currentBid) return 'winning';
    if (bid.amount < currentBid) return 'outbid';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'winning': return 'text-green-600 bg-green-100';
      case 'outbid': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">🔥 Live Bidding</h3>
            <p className="text-sm text-gray-600">{product?.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
            <div className="text-sm text-gray-500">Time Remaining</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Bidding Area */}
          <div className="flex-1 p-4">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">${currentBid}</div>
                <div className="text-sm text-gray-600">Current Highest Bid</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bid Amount
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    min={currentBid + 1}
                    step="0.01"
                  />
                  <button
                    onClick={placeBid}
                    disabled={isBidding || !bidAmount || parseFloat(bidAmount) <= currentBid}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isBidding ? 'Bidding...' : 'Place Bid'}
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Minimum bid: ${(currentBid + 1).toFixed(2)}
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoBid}
                    onChange={(e) => setAutoBid(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Auto-Bidding</span>
                </label>
                {autoBid && (
                  <div className="mt-2">
                    <input
                      type="number"
                      placeholder="Maximum bid amount"
                      value={maxBid}
                      onChange={(e) => setMaxBid(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      min={currentBid + 1}
                      step="0.01"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      🤖 Auto-bid will place bids up to this amount
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bids History */}
          <div className="w-80 border-l p-4">
            <h4 className="font-semibold mb-3">Recent Bids</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bids.slice(0, 10).map((bid, index) => (
                <div
                  key={bid.id}
                  className={`p-2 rounded-lg border ${
                    bid.bidderId === user?.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">${bid.amount}</div>
                      <div className="text-xs text-gray-500">
                        {bid.bidderId === user?.id ? 'You' : `Bidder ${bid.bidderId.slice(-4)}`}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getBidStatus(bid))}`}>
                      {getBidStatus(bid)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(bid.timestamp).toLocaleTimeString()}
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

export default LiveBidding;
