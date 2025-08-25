



import React, { useEffect } from 'react';
import { CartItem, TimeSlot } from '../types';
import { Package, Clock, User, CreditCard, X, Minus, Plus } from 'lucide-react';

interface OrderSummaryProps {
  cartItems: CartItem[];
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  onCompleteOrder: () => void;
  onRemoveFromCart?: (serviceId: string, selectedOptions: string[]) => void;
  onUpdateQuantity?: (
    serviceId: string,
    selectedOptions: string[],
    newQuantity: number
  ) => void;
}

export default function OrderSummary({
  cartItems,
  selectedDate,
  selectedTimeSlot,
  onCompleteOrder,
  onRemoveFromCart,
  onUpdateQuantity
}: OrderSummaryProps) {
  // const calculateItemTotal = (item: CartItem) => {
  //   const optionTotal = item.selectedOptions.reduce((sum, optionId) => {
  //     const option = item?.service?.options?.find(opt => opt._id === optionId);
  //     return sum + (option?.price || 0);
  //   }, 0);
  //   return optionTotal * item.quantity;
  // };
  const calculateItemTotal = (item: CartItem) => {
    if (!item?.service?.options) return 0;

    const optionPriceSum = item.selectedOptions.reduce((total, optionId) => {
      const option = item.service.options.find(opt => opt.id === optionId);
      // const option = item.service.options.find(opt => opt._id === optionId);

      return total + (option?.price || 0);
    }, 0);

    return optionPriceSum * item.quantity; // ✅ multiply by quantity
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (selectedTimeSlot) {
      localStorage.setItem('selectedTimeSlot', JSON.stringify(selectedTimeSlot));
    }
    if (selectedDate) {
      localStorage.setItem('selectedDate', selectedDate);
    }

    if (cartItems.length > 0) {
      const updatedCart = cartItems.map(item => {
        const washermanObj = item?.service?.washerman || item?.washerman;
        const washermanId =
          typeof washermanObj === 'object' && washermanObj?._id?.length === 24
            ? washermanObj._id
            : typeof item?.washermanId === 'string'
              ? item.washermanId
              : '684fdb3e2ef2b4179b022277'; // fallback

        const washermanName =
          typeof washermanObj === 'object' && washermanObj?.name
            ? washermanObj.name
            : typeof washermanObj === 'string'
              ? washermanObj
              : '';

        const productName = item?.service?.name || item?.name || '';

        return {
          washermanId,
          washerman: washermanName,
          serviceId: item.serviceId,
          productId: item.serviceId,
          service: item.service,
          name: productName,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || []
        };
      });

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      localStorage.setItem('quantity', cartItems[0]?.quantity?.toString() || '1');
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems, selectedDate, selectedTimeSlot]);

  const getWashermanName = (item: CartItem) => {
    if (item?.service?.washerman?.name) return item.service.washerman.name;
    if (typeof item?.washerman === 'string') return item.washerman;
    if (typeof item?.washerman === 'object' && item.washerman?.name)
      return item.washerman.name;
    return '';
  };

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      shirt: 'Shirt',
      pants: 'Pants',
      suits: 'Suits',
      bedding: 'Bedding'
    };
    return categoryMap[category] || category;
  };

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (onUpdateQuantity && newQuantity >= 1) {
      onUpdateQuantity(item.serviceId, item.selectedOptions, newQuantity);
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    if (onRemoveFromCart) {
      onRemoveFromCart(item.serviceId, item.selectedOptions);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <p className="text-gray-600">No items in your cart</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-20">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Package className="w-5 h-5 mr-2 text-blue-600" />
        Order Summary
      </h3>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {cartItems.map(item => (
          <div
            key={`${item.serviceId}-${item.selectedOptions.join('-')}`}
            className="border border-gray-100 rounded-lg p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">
                      {item?.service?.name || item.name}
                    </h4>
                    <p className="text-xs md:text-sm text-blue-600 font-medium">
                      {getCategoryName(item?.service?.category || '')}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Dhobi : {getWashermanName(item)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Remove from cart"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {item.selectedOptions.length > 0 && (
                  <div className="text-xs md:text-sm text-gray-600 mt-1">
                    Service:{' '}
                    {/* {item.selectedOptions
                      .map(optionId => {
                        const option = item?.service?.options?.find(
                          opt => opt._id === optionId
                        );
                        return option?.name || optionId;
                      })
                      .join(', ')} */}
                    {item.selectedOptions
                      .map(optionId => {
                        const option = item?.service?.options?.find(opt => opt.id === optionId); // ✅ fix here
                        // const option = item?.service?.options?.find(opt => opt._id === optionId);
                        return option?.name || optionId;
                      })
                      .join(', ')}


                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={item.quantity <= 1}
                      className="p-1 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    ₹{calculateItemTotal(item)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center mb-2 text-sm md:text-base">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span className="font-medium">₹{totalAmount}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total</span>
          <span className="text-blue-600">₹{totalAmount}</span>
        </div>
      </div>

      {selectedDate && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center text-sm text-blue-800">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {new Date(selectedDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          {selectedTimeSlot && (
            <div className="flex items-center text-sm text-blue-800 mt-1">
              <User className="w-4 h-4 mr-2" />
              <span>{selectedTimeSlot.time}</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onCompleteOrder}
        disabled={!selectedTimeSlot}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center text-sm md:text-base"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {selectedTimeSlot ? 'Go for Payment' : 'Please Select a Time Slot'}
      </button>
    </div>
  );
}
