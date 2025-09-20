import React, { useState } from 'react';
import { Star, Upload, X, Camera } from 'lucide-react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const ReviewForm = ({ 
  onSubmit, 
  onCancel, 
  product, 
  vendor, 
  orderId,
  isEditing = false,
  initialData = null 
}) => {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 0,
    title: initialData?.title || '',
    comment: initialData?.comment || '',
    images: initialData?.images || [],
    recommend: initialData?.recommend || false,
    deliveryRating: initialData?.deliveryRating || 0,
    communicationRating: initialData?.communicationRating || 0,
    valueRating: initialData?.valueRating || 0
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Simulate image upload - replace with actual upload logic
      const uploadedImages = await Promise.all(
        files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please provide a title for your review');
      return;
    }

    if (!formData.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    const reviewData = {
      ...formData,
      product: product ? {
        id: product.id,
        name: product.name,
        image: product.images?.[0]
      } : null,
      vendor: vendor ? {
        id: vendor.id,
        name: vendor.name
      } : null,
      orderId,
      createdAt: new Date().toISOString(),
      verified: true // Assuming verified for demo
    };

    onSubmit(reviewData);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => handleChange('rating', rating)}
            interactive={true}
            showValue={true}
            size="lg"
          />
          <p className="text-sm text-gray-500 mt-1">
            How would you rate your overall experience?
          </p>
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Speed
            </label>
            <StarRating
              rating={formData.deliveryRating}
              onRatingChange={(rating) => handleChange('deliveryRating', rating)}
              interactive={true}
              size="md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Communication
            </label>
            <StarRating
              rating={formData.communicationRating}
              onRatingChange={(rating) => handleChange('communicationRating', rating)}
              interactive={true}
              size="md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value for Money
            </label>
            <StarRating
              rating={formData.valueRating}
              onRatingChange={(rating) => handleChange('valueRating', rating)}
              interactive={true}
              size="md"
            />
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Summarize your experience in a few words"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            maxLength={100}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Review Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            placeholder="Tell others about your experience with this product/vendor..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.comment.length}/1000 characters
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos (Optional)
          </label>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Uploaded Images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recommend"
            checked={formData.recommend}
            onChange={(e) => handleChange('recommend', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="recommend" className="ml-2 text-sm text-gray-700">
            I would recommend this to others
          </label>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : (isEditing ? 'Update Review' : 'Submit Review')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
