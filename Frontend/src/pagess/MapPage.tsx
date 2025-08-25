// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, MapPin } from 'lucide-react';
// import NearbyWashermenMap from '../components/NearbyWashermenMap';
// import MapTest from '../components/MapTest';

// const MapPage: React.FC = () => {
//   const handleLocationSelect = (lat: number, lng: number) => {
//     // This will be used to refresh the map with new data
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <Link 
//                 to="/" 
//                 className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 mr-2" />
//                 Back to Home
//               </Link>
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <MapPin className="w-6 h-6 text-blue-600" />
//               <h1 className="text-xl font-bold text-gray-900">Nearby Washermen</h1>
//             </div>
            
//             <div className="w-20"></div> {/* Spacer for centering */}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Find Washermen Near You
//           </h2>
//           <p className="text-gray-600">
//             View all available washermen in your area. Green circles show their service range.
//           </p>
//         </div>

//         {/* Test Tools */}
//         <MapTest onLocationSelect={handleLocationSelect} />

//         {/* Map Container */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <NearbyWashermenMap />
//         </div>

//         {/* Instructions */}
//         <div className="mt-6 bg-blue-50 rounded-lg p-4">
//           <h3 className="font-semibold text-blue-900 mb-2">How to use the map:</h3>
//           <ul className="text-blue-800 text-sm space-y-1">
//             <li>• <strong>📍 Blue marker:</strong> Your current location</li>
//             <li>• <strong>📍 Red markers:</strong> Available washermen</li>
//             <li>• <strong>🟢 Green circles:</strong> Service range (within range)</li>
//             <li>• <strong>⚫ Gray circles:</strong> Service range (out of range)</li>
//             <li>• <strong>Click on markers</strong> to see washerman details</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapPage; 