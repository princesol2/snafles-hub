import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const HelperPoints = ({ onClose }) => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [rewards, setRewards] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    fetchUserPoints();
    fetchRewards();
    fetchRedeemedRewards();
  }, []);

  const fetchUserPoints = async () => {
    try {
      const response = await api.get('/rewards/points');
      setPoints(response.data.points);
      setLevel(response.data.level);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await api.get('/rewards/available');
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const fetchRedeemedRewards = async () => {
    try {
      const response = await api.get('/rewards/redeemed');
      setRedeemedRewards(response.data);
    } catch (error) {
      console.error('Error fetching redeemed rewards:', error);
    }
  };

  const redeemReward = async (rewardId) => {
    setIsRedeeming(true);
    try {
      await api.post(`/rewards/redeem/${rewardId}`);
      fetchUserPoints();
      fetchRedeemedRewards();
      setSelectedReward(null);
    } catch (error) {
      console.error('Error redeeming reward:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const getLevelInfo = (level) => {
    const levels = {
      1: { name: 'Helper', color: 'bg-gray-100 text-gray-800', points: 0 },
      2: { name: 'Trusted Helper', color: 'bg-green-100 text-green-800', points: 100 },
      3: { name: 'Super Helper', color: 'bg-blue-100 text-blue-800', points: 500 },
      4: { name: 'Elite Helper', color: 'bg-purple-100 text-purple-800', points: 1000 },
      5: { name: 'Legendary Helper', color: 'bg-yellow-100 text-yellow-800', points: 2500 }
    };
    return levels[level] || levels[1];
  };

  const getNextLevelPoints = () => {
    const nextLevel = level + 1;
    const levelInfo = getLevelInfo(nextLevel);
    return levelInfo.points - points;
  };

  const getProgressPercentage = () => {
    const currentLevelInfo = getLevelInfo(level);
    const nextLevelInfo = getLevelInfo(level + 1);
    if (!nextLevelInfo) return 100;
    
    const progress = ((points - currentLevelInfo.points) / (nextLevelInfo.points - currentLevelInfo.points)) * 100;
    return Math.min(progress, 100);
  };

  const getRewardIcon = (type) => {
    switch (type) {
      case 'discount': return '💰';
      case 'free_item': return '🎁';
      case 'premium': return '⭐';
      case 'exclusive': return '👑';
      default: return '🎯';
    }
  };

  const getRewardColor = (type) => {
    switch (type) {
      case 'discount': return 'border-green-200 bg-green-50';
      case 'free_item': return 'border-blue-200 bg-blue-50';
      case 'premium': return 'border-purple-200 bg-purple-50';
      case 'exclusive': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">🏆 Helper Points & Rewards</h3>
            <p className="text-sm text-gray-600">Earn points by helping others, redeem for amazing rewards!</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Points & Level */}
          <div className="w-80 p-4 border-r">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600">{points}</div>
              <div className="text-sm text-gray-600">Helper Points</div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Level {level}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelInfo(level).color}`}>
                  {getLevelInfo(level).name}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getNextLevelPoints()} points to next level
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">How to Earn Points:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Help someone with funds</span>
                  <span className="font-medium text-green-600">+50 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful repayment</span>
                  <span className="font-medium text-green-600">+25 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Refer a friend</span>
                  <span className="font-medium text-green-600">+100 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Complete profile</span>
                  <span className="font-medium text-green-600">+10 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex-1 p-4">
            <h4 className="font-semibold mb-4">Available Rewards</h4>
            
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${getRewardColor(reward.type)}`}
                  onClick={() => setSelectedReward(reward)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{getRewardIcon(reward.type)}</div>
                    <div className="font-medium text-sm mb-1">{reward.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{reward.description}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-blue-600">{reward.pointsCost} pts</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        points >= reward.pointsCost ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {points >= reward.pointsCost ? 'Available' : 'Need more points'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Redeem Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Redeem Reward</h3>
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{getRewardIcon(selectedReward.type)}</div>
                <div className="font-medium">{selectedReward.name}</div>
                <div className="text-sm text-gray-600">{selectedReward.description}</div>
                <div className="text-sm text-blue-600 mt-2">
                  Cost: {selectedReward.pointsCost} points
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => redeemReward(selectedReward.id)}
                  disabled={isRedeeming || points < selectedReward.pointsCost}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isRedeeming ? 'Redeeming...' : 'Redeem'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelperPoints;
