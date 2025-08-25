






import React from 'react';
import { Order, OrderStatus } from '../types/order';
import { calculateTotal, formatDate, getStatusColor } from './utills/orderUtills';
import OrderItemComponent from './OrderItem';
import { Package } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  if (!order) return <div>Order not found.</div>;

  // Helper function to format address
  const formatAddress = (address: any) => {
    if (!address) return 'Address not available';
    
    // If address is a string, return it directly
    if (typeof address === 'string') return address;
    
    // If address has fullAddress, use it (new detailed address format)
    if (address.fullAddress) return address.fullAddress;
    
    // If address is an object with detailed fields (new format)
    if (address.houseNo || address.street || address.city || address.state || address.pincode) {
      const parts = [
        address.houseNo,
        address.street,
        address.landmark,
        address.city,
        address.state,
        address.pincode
      ].filter(Boolean);
      
      return parts.length > 0 ? parts.join(', ') : 'Address not available';
    }
    
    // Fallback to old format
    if (address.street || address.city || address.state || address.zip) {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.zip
      ].filter(Boolean);
      
      return parts.length > 0 ? parts.join(', ') : 'Address not available';
    }
    
    return 'Address not available';
  };

  const {
    _id,
    productId,
    date,
    slot,
    quantity,
    totalAmount,
    status,
    paymentStatus,
    paymentMethod,
    washerman,
    guest,
    createdAt,
  } = order;

  const formattedDate = formatDate(date);
  const total = totalAmount || 0;
  const image = productId?.image || '';
  const name = productId?.category || productId?.name || 'Service';
  const washermanName = washerman?.name || 'Unknown';
  const washermanContact = washerman?.contact || 'Not available';
  const washermanId = washerman?._id || 'N/A';
  const guestId = guest || 'N/A';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-1/3 p-4 flex items-center justify-center bg-gray-50">
          {image ? (
            <img
              src={image}
              alt={`Order ${_id}`}
              className="w-full h-48 object-contain rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/5217766/pexels-photo-5217766.jpeg';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
              <Package size={64} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Order #{_id}</h3>
              <p className="text-sm text-gray-600 mb-1">{name}</p>
              <p className="text-sm text-gray-600  mb-1">
                Service:
                {order.selectedOptions && order.selectedOptions.length > 0
                  ? ' ' + order.selectedOptions.map(opt => opt.name).join(', ')
                  : ' N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-1"> pick up:
                {formattedDate || 'Invalid Date'} | Slot: {slot?.range || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-1">Quantity: {quantity}</p>
              <p className="text-sm text-gray-700 mb-1">Payment: ₹{total} via {paymentMethod || 'N/A'}</p>
              <p className="text-sm text-gray-700 mb-1">Payment Status: {paymentStatus}</p>
              <p className="text-sm text-gray-500">Dhobi : {washermanName}</p>
              <p className="text-sm text-gray-500">Contact: {washermanContact}</p>
              <p className="text-sm text-gray-500">Created At: {new Date(createdAt).toLocaleString()}</p>
              {order.deliveryAddress ? (
                <div className="text-sm text-gray-600 mb-1">
                  <p className="font-medium text-gray-700">Delivery Address:</p>
                  <p>{formatAddress(order.deliveryAddress)}</p>
                  {order.deliveryInstructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Instructions:</span> {order.deliveryInstructions}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-1">
                  Customer Address: {formatAddress(order.guest?.address)}
                </p>
              )}

            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                status as OrderStatus
              )} mt-2 sm:mt-0`}
            >
              {status}
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="border-t border-gray-100 pt-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Order Items</h4>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <OrderItemComponent key={index} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-green-600">₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;











// OrderCard.tsx

// import React from 'react';
// import { Order, OrderStatus } from '../types/order';
// import { calculateTotal, formatDate, getStatusColor } from './utills/orderUtills';
// import OrderItemComponent from './OrderItem';
// import { Package } from 'lucide-react';

// interface OrderCardProps {
//   order: Order;
// }

// const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
//   if (!order) return <div>Order not found.</div>;

//   const {
//     _id,
//     productId,
//     date,
//     slot,
//     quantity,
//     totalAmount,
//     status,
//     paymentStatus,
//     paymentMethod,
//     washerman,
//     guest,
//     createdAt,
//   } = order;

//   const formattedDate = formatDate(date);
//   const total = totalAmount || 0;
//   const image = productId?.image || '';
//   const category = productId?.category || 'Service';
//   const serviceName = productId?.name || 'Unnamed Service';
//   const washermanName = washerman?.name || 'Unknown';
//   const washermanContact = washerman?.contact || 'Not available';

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
//       <div className="flex flex-col md:flex-row">
//         {/* Image */}
//         <div className="w-full md:w-1/3 p-4 flex items-center justify-center bg-gray-50">
//           {image ? (
//             <img
//               src={image}
//               alt={`Order ${_id}`}
//               className="w-full h-48 object-contain rounded-md"
//               onError={(e) => {
//                 const target = e.target as HTMLImageElement;
//                 target.src = 'https://images.pexels.com/photos/5217766/pexels-photo-5217766.jpeg';
//               }}
//             />
//           ) : (
//             <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
//               <Package size={64} className="text-gray-400" />
//             </div>
//           )}
//         </div>

//         {/* Details */}
//         <div className="flex-1 p-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//             <div>
//               <h3 className="text-lg font-bold text-gray-800 mb-1">Order #{_id}</h3>
//               <p className="text-sm text-gray-600 mb-1">Category: {category}</p>
//           <p className="text-sm text-gray-700 font-semibold mb-1">
//   Service:
//   {order.selectedOptions && order.selectedOptions.length > 0
//     ? ' ' + order.selectedOptions.map(opt => opt.name).join(', ')
//     : ' N/A'}
// </p>

//               <p className="text-sm text-gray-500 mb-1">
//                 Pick-up: {formattedDate || 'Invalid Date'} | Slot: {slot?.range || 'N/A'}
//               </p>
//               <p className="text-sm text-gray-500 mb-1">Quantity: {quantity}</p>
//               <p className="text-sm text-gray-500 mb-1">
//                 Payment: ₹{total} via {paymentMethod || 'N/A'}
//               </p>
//               <p className="text-sm text-gray-500 mb-1">Payment Status: {paymentStatus}</p>
//               <p className="text-sm text-gray-400">Washerman: {washermanName}</p>
//               <p className="text-sm text-gray-400">Contact: {washermanContact}</p>
//               <p className="text-sm text-gray-400">
//                 Created At: {new Date(createdAt).toLocaleString()}
//               </p>
//             </div>
//             <div
//               className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                 status as OrderStatus
//               )} mt-2 sm:mt-0`}
//             >
//               {status}
//             </div>
//           </div>

//           {/* Order Items */}
//           {order.items && order.items.length > 0 && (
//             <div className="border-t border-gray-100 pt-4 mb-4">
//               <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Order Items</h4>
//               <div className="space-y-1">
//                 {order.items.map((item, index) => (
//                   <OrderItemComponent key={index} item={item} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Total */}
//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <span className="text-sm font-medium text-gray-600">Total Amount</span>
//             <span className="text-xl font-bold text-green-600">₹{total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderCard;
