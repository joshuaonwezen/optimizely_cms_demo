import React from 'react';

interface SkeletonLoaderProps {
  type?: 'experience' | 'city' | 'search' | 'default';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'default' }) => {
  const renderExperienceSkeleton = () => (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-200 rounded-lg"></div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCitySkeleton = () => (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-200 rounded-lg"></div>
      
      {/* Hero section skeleton */}
      <div className="bg-gray-200 rounded-lg p-8 space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-64 bg-gray-300 rounded"></div>
      </div>
      
      {/* Content sections skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5"></div>
              <div className="h-4 bg-gray-300 rounded w-3/5"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSearchSkeleton = () => (
    <div className="w-full space-y-6 animate-pulse">
      {/* Search header skeleton */}
      <div className="h-16 bg-gray-200 rounded-lg"></div>
      
      {/* Search results skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 flex space-x-4">
            <div className="w-24 h-24 bg-gray-300 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDefaultSkeleton = () => (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-200 rounded-lg"></div>
      
      {/* Main content skeleton */}
      <div className="bg-gray-200 rounded-lg p-8 space-y-6">
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="h-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const skeletonMap = {
    experience: renderExperienceSkeleton,
    city: renderCitySkeleton,
    search: renderSearchSkeleton,
    default: renderDefaultSkeleton,
  };

  return (
    <div className="relative w-full flex-1 p-4">
      {skeletonMap[type]()}
    </div>
  );
};

export default SkeletonLoader;