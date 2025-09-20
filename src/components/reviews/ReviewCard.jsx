import React from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, MoreVertical } from 'lucide-react';
import StarRating from './StarRating';

const ReviewCard = ({ 
  review, 
  onLike, 
  onDislike, 
  onReport, 
  onDelete,
  showActions = true,
  isOwner = false 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(review.user.name)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2">
            {isOwner && (
              <button
                onClick={() => onDelete && onDelete(review.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onReport && onReport(review.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Product/Vendor Info */}
      {review.product && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={review.product.image}
              alt={review.product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h6 className="font-medium text-gray-900">{review.product.name}</h6>
              <p className="text-sm text-gray-600">Product Review</p>
            </div>
          </div>
        </div>
      )}

      {review.vendor && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {getInitials(review.vendor.name)}
            </div>
            <div>
              <h6 className="font-medium text-gray-900">{review.vendor.name}</h6>
              <p className="text-sm text-gray-600">Vendor Review</p>
            </div>
          </div>
        </div>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  // Open image in modal or lightbox
                  window.open(image, '_blank');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike && onLike(review.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
              review.liked
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{review.likes || 0}</span>
          </button>
          
          <button
            onClick={() => onDislike && onDislike(review.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
              review.disliked
                ? 'bg-red-100 text-red-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{review.dislikes || 0}</span>
          </button>
        </div>

        <div className="text-sm text-gray-500">
          {review.verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
              ✓ Verified Purchase
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
