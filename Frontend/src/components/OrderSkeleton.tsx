import React from 'react';

const OrderSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Skeleton Image */}
        <div className="w-full md:w-1/3 p-4 flex items-center justify-center bg-gray-50">
          <div className="w-full h-48 bg-gray-200 rounded-md" />
        </div>
        
        {/* Skeleton Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="w-full sm:w-2/3">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-24 mt-2 sm:mt-0" />
          </div>
          
          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between py-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/6" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="h-5 bg-gray-200 rounded w-1/4" />
            <div className="h-6 bg-gray-200 rounded w-1/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSkeleton;