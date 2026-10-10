import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-3"
        >
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-200 pt-2" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
};
