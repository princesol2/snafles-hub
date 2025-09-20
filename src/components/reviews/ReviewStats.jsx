import React from 'react';
import { Star, TrendingUp, Users, ThumbsUp } from 'lucide-react';
import StarRating from './StarRating';

const ReviewStats = ({ 
  reviews = [], 
  type = 'product', // 'product' or 'vendor'
  className = '' 
}) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    stars: star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: totalReviews > 0 
      ? (reviews.filter(review => review.rating === star).length / totalReviews) * 100 
      : 0
  }));

  const recommendCount = reviews.filter(review => review.recommend).length;
  const recommendPercentage = totalReviews > 0 ? (recommendCount / totalReviews) * 100 : 0;

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Below Average';
    return 'Poor';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-green-500';
    if (rating >= 3.5) return 'text-yellow-500';
    if (rating >= 3.0) return 'text-yellow-600';
    if (rating >= 2.0) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {type === 'product' ? 'Product Reviews' : 'Vendor Reviews'}
        </h3>
        <div className="text-sm text-gray-500">
          {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Overall Rating */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center mb-2">
          <StarRating rating={averageRating} size="lg" />
        </div>
        <div className={`text-lg font-medium ${getRatingColor(averageRating)}`}>
          {getRatingText(averageRating)}
        </div>
        <div className="text-sm text-gray-500">
          Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2 mb-6">
        {ratingDistribution.map(({ stars, count, percentage }) => (
          <div key={stars} className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 w-16">
              <span className="text-sm font-medium text-gray-700">{stars}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="w-12 text-right">
              <span className="text-sm text-gray-600">{count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Stats */}
      {recommendCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Recommendation Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-700 mb-1">
            {recommendPercentage.toFixed(0)}%
          </div>
          <div className="text-sm text-green-600">
            {recommendCount} out of {totalReviews} reviewers recommend this {type}
          </div>
        </div>
      )}

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalReviews}
          </div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>
      </div>

      {/* Recent Activity */}
      {reviews.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Recent Activity</span>
          </div>
          <div className="space-y-2">
            {reviews.slice(0, 3).map((review, index) => (
              <div key={review.id} className="flex items-center space-x-3 text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{review.user.name}</span>
                  <span className="text-gray-500"> rated </span>
                  <span className="font-medium text-gray-900">{review.rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current inline ml-1" />
                </div>
                <div className="text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Reviews State */}
      {reviews.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
          <p className="text-gray-600">
            Be the first to review this {type}!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewStats;
