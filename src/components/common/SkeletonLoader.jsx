import React from 'react';

const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 p-4 animate-pulse">
            <div className="flex space-x-4">
              <div className="rounded-lg bg-gray-300 bg-gray-600 h-20 w-20 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        );

      case 'product':
        return (
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300 bg-gray-600"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 bg-gray-600 rounded w-1/3"></div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="rounded-full bg-gray-300 bg-gray-600 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="bg-white bg-gray-800 rounded-lg shadow-sm border border-gray-200 border-gray-700 overflow-hidden animate-pulse">
            <div className="p-4 border-b border-gray-200 border-gray-700">
              <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/4"></div>
            </div>
            <div className="divide-y divide-gray-200 divide-gray-700">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-center space-x-4">
                  <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-300 bg-gray-600 rounded w-1/8"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-300 bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 bg-gray-600 rounded w-4/6"></div>
          </div>
        );

      case 'avatar':
        return (
          <div className="animate-pulse">
            <div className="rounded-full bg-gray-300 bg-gray-600 h-12 w-12"></div>
          </div>
        );

      case 'button':
        return (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 bg-gray-600 rounded-lg w-24"></div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-300 bg-gray-600 rounded animate-pulse h-4 w-full"></div>
        );
    }
  };

  if (count === 1) {
    return <div className={className}>{renderSkeleton()}</div>;
  }

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="mb-4">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
