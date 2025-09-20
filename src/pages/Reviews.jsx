import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Filter, 
  Search, 
  SortAsc, 
  ThumbsUp, 
  ThumbsDown, 
  Flag,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Users,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewStats from '../components/reviews/ReviewStats';
import StarRating from '../components/reviews/StarRating';
import toast from 'react-hot-toast';

const Reviews = () => {
  const { id, type } = useParams(); // type: 'product' or 'vendor'
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showOnlyImages, setShowOnlyImages] = useState(false);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [id, type]);

  useEffect(() => {
    applyFilters();
  }, [reviews, searchQuery, ratingFilter, sortBy, showOnlyImages, showOnlyVerified]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReviews = [
        {
          id: 1,
          user: {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
          },
          rating: 5,
          title: 'Absolutely amazing product!',
          comment: 'This exceeded my expectations in every way. The quality is outstanding and the vendor was very responsive. Highly recommend!',
          images: [
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop'
          ],
          product: type === 'product' ? {
            id: id,
            name: 'Handcrafted Silver Necklace',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'
          } : null,
          vendor: type === 'vendor' ? {
            id: id,
            name: 'Artisan Crafts Co.'
          } : {
            id: 1,
            name: 'Artisan Crafts Co.'
          },
          likes: 12,
          dislikes: 0,
          liked: false,
          disliked: false,
          recommend: true,
          verified: true,
          deliveryRating: 5,
          communicationRating: 5,
          valueRating: 5,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          user: {
            id: 2,
            name: 'Mike Wilson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
          },
          rating: 4,
          title: 'Good quality, fast delivery',
          comment: 'The product arrived quickly and was well packaged. Quality is good for the price. Would order again.',
          images: [],
          product: type === 'product' ? {
            id: id,
            name: 'Handcrafted Silver Necklace',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'
          } : null,
          vendor: type === 'vendor' ? {
            id: id,
            name: 'Artisan Crafts Co.'
          } : {
            id: 1,
            name: 'Artisan Crafts Co.'
          },
          likes: 8,
          dislikes: 1,
          liked: false,
          disliked: false,
          recommend: true,
          verified: true,
          deliveryRating: 4,
          communicationRating: 4,
          valueRating: 4,
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-14T15:45:00Z'
        },
        {
          id: 3,
          user: {
            id: 3,
            name: 'Emma Davis',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
          },
          rating: 3,
          title: 'Decent but could be better',
          comment: 'The product is okay but not exactly what I expected. The vendor was helpful though. Average experience.',
          images: [
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=300&fit=crop'
          ],
          product: type === 'product' ? {
            id: id,
            name: 'Handcrafted Silver Necklace',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'
          } : null,
          vendor: type === 'vendor' ? {
            id: id,
            name: 'Artisan Crafts Co.'
          } : {
            id: 1,
            name: 'Artisan Crafts Co.'
          },
          likes: 3,
          dislikes: 2,
          liked: false,
          disliked: false,
          recommend: false,
          verified: true,
          deliveryRating: 3,
          communicationRating: 4,
          valueRating: 3,
          createdAt: '2024-01-13T09:20:00Z',
          updatedAt: '2024-01-13T09:20:00Z'
        },
        {
          id: 4,
          user: {
            id: 4,
            name: 'John Smith',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
          },
          rating: 5,
          title: 'Perfect! Will definitely order again',
          comment: 'Exceptional quality and service. The vendor went above and beyond to ensure I was satisfied. Highly recommend!',
          images: [
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=300&fit=crop'
          ],
          product: type === 'product' ? {
            id: id,
            name: 'Handcrafted Silver Necklace',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'
          } : null,
          vendor: type === 'vendor' ? {
            id: id,
            name: 'Artisan Crafts Co.'
          } : {
            id: 1,
            name: 'Artisan Crafts Co.'
          },
          likes: 15,
          dislikes: 0,
          liked: false,
          disliked: false,
          recommend: true,
          verified: true,
          deliveryRating: 5,
          communicationRating: 5,
          valueRating: 5,
          createdAt: '2024-01-12T14:15:00Z',
          updatedAt: '2024-01-12T14:15:00Z'
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Images filter
    if (showOnlyImages) {
      filtered = filtered.filter(review => review.images && review.images.length > 0);
    }

    // Verified filter
    if (showOnlyVerified) {
      filtered = filtered.filter(review => review.verified);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'most_helpful':
          return (b.likes - b.dislikes) - (a.likes - a.dislikes);
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  };

  const handleLike = (reviewId) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const wasLiked = review.liked;
        const wasDisliked = review.disliked;
        
        return {
          ...review,
          liked: !wasLiked,
          disliked: false,
          likes: wasLiked ? review.likes - 1 : review.likes + 1,
          dislikes: wasDisliked ? review.dislikes - 1 : review.dislikes
        };
      }
      return review;
    }));
  };

  const handleDislike = (reviewId) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const wasLiked = review.liked;
        const wasDisliked = review.disliked;
        
        return {
          ...review,
          liked: false,
          disliked: !wasDisliked,
          likes: wasLiked ? review.likes - 1 : review.likes,
          dislikes: wasDisliked ? review.dislikes - 1 : review.dislikes + 1
        };
      }
      return review;
    }));
  };

  const handleReport = (reviewId) => {
    toast.success('Review reported. Thank you for your feedback.');
  };

  const handleDelete = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    toast.success('Review deleted successfully');
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleSubmitReview = (reviewData) => {
    if (editingReview) {
      // Update existing review
      setReviews(prev => prev.map(review => 
        review.id === editingReview.id 
          ? { ...review, ...reviewData, updatedAt: new Date().toISOString() }
          : review
      ));
      toast.success('Review updated successfully');
    } else {
      // Add new review
      const newReview = {
        ...reviewData,
        id: Date.now(),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        likes: 0,
        dislikes: 0,
        liked: false,
        disliked: false
      };
      setReviews(prev => [newReview, ...prev]);
      toast.success('Review submitted successfully');
    }
    
    setShowReviewForm(false);
    setEditingReview(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {type === 'product' ? 'Product Reviews' : 'Vendor Reviews'}
              </h1>
              <p className="text-gray-600 mt-2">
                See what customers are saying about this {type}
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Write Review</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Review Stats */}
          <div className="lg:col-span-1">
            <ReviewStats reviews={reviews} type={type} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Reviews
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="most_helpful">Most Helpful</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showOnlyImages}
                      onChange={(e) => setShowOnlyImages(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">With Images</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showOnlyVerified}
                      onChange={(e) => setShowOnlyVerified(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onReport={handleReport}
                  onDelete={user?.id === review.user.id ? handleDelete : null}
                  showActions={true}
                  isOwner={user?.id === review.user.id}
                />
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600">
                  {searchQuery || ratingFilter !== 'all' || showOnlyImages || showOnlyVerified
                    ? 'Try adjusting your filters to see more reviews.'
                    : 'Be the first to review this ' + type + '!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ReviewForm
                onSubmit={handleSubmitReview}
                onCancel={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                }}
                product={type === 'product' ? { id, name: 'Product Name' } : null}
                vendor={type === 'vendor' ? { id, name: 'Vendor Name' } : null}
                orderId={`ORD-${Date.now()}`}
                isEditing={!!editingReview}
                initialData={editingReview}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
