import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Truck, Check, ArrowLeft, MapPin } from 'lucide-react';
import axios from '../utilss/axios'; // Adjust the import path as necessary
import Swal from 'sweetalert2';
import AddressModal from '../components/AddressModal';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const state = location.state || {};
  let pickupDate = state.selectedDate || localStorage.getItem('selectedDate');
  let pickupTimeSlot = state.selectedTimeSlot || JSON.parse(localStorage.getItem('selectedTimeSlot') || '{}');

  console.log("📦 Final pickupTimeSlot:", pickupTimeSlot);

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const selectedDate = localStorage.getItem('selectedDate');
      const selectedTimeSlot = JSON.parse(localStorage.getItem('selectedTimeSlot') || 'null');
      const savedDeliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress') || 'null');

      setCartItems(storedCart);
      if (!pickupDate) pickupDate = selectedDate;
      if (!pickupTimeSlot) pickupTimeSlot = selectedTimeSlot;

      // Load saved delivery address if available
      if (savedDeliveryAddress) {
        setDeliveryAddress(savedDeliveryAddress);
      }

      if (!storedCart.length || !pickupDate || !pickupTimeSlot) {
        throw new Error('Missing booking info');
      }

      const calculatedTotal = storedCart.reduce((sum: number, item: any) => {
        const options = item.service?.options || [];
        // const pricePerItem = item.selectedOptions.reduce((acc: number, optionId: string) => {
        //   const found = options.find((opt: any) => opt._id === optionId);
        //   return acc + (found?.price || 0);
        // }, 0);
        const pricePerItem = item.selectedOptions.reduce((acc: number, optionId: string) => {
          const found = options.find((opt: any) => opt.id === optionId); // ✅ Match by `id` now
          return acc + (found?.price || 0);
        }, 0);

        return sum + pricePerItem * item.quantity;
      }, 0);

      setTotal(calculatedTotal);
    } catch (err) {
      Swal.fire('Error', 'Invalid or missing cart data', 'error').then(() => navigate('/mainapp'));
    }
  }, [navigate]);

  const handleAddressSave = (address) => {
    setDeliveryAddress(address);
    setShowAddressModal(false);
    
    // Save to localStorage for future use
    localStorage.setItem('deliveryAddress', JSON.stringify(address));
  };

  const handleAddressModalClose = () => {
    setShowAddressModal(false);
  };

  const handleProceed = async () => {
    if (!pickupDate || !pickupTimeSlot || cartItems.length === 0) {
      Swal.fire('Error', 'Incomplete booking data.', 'error');
      return;
    }

    // Check if delivery address is provided
    if (!deliveryAddress) {
      setShowAddressModal(true);
      return;
    }

    // ✅ FIXED: format slot with `period` and `time`
    const formattedSlot = {
      label: pickupTimeSlot?.period?.toLowerCase?.() || '',
      range: pickupTimeSlot?.time?.trim?.() || ''
    };

    console.log("✅ Sending formatted slot:", formattedSlot);

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        '/api/booking/create-multi',
        {
          items: cartItems.map(item => ({
            productId: item.service?._id || item.productId,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions || []
          })),
          pickupDate,
          pickupTimeSlot: formattedSlot,
          totalAmount: total,
          paymentMethod: 'cash',
          deliveryAddress: deliveryAddress,
          deliveryInstructions: deliveryInstructions
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Swal.fire('Order Placed', 'Cash on Delivery confirmed!', 'success');
      localStorage.removeItem('cart');
      localStorage.removeItem('selectedDate');
      localStorage.removeItem('selectedTimeSlot');
      localStorage.removeItem('quantity');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Payment</h1>
            <p className="text-sm text-gray-500">Review your order and proceed</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 border-t pt-3">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-700">
                <span>
                  {item.name || item.service?.name} x {item.quantity}
                </span>
                {/* <span>
                  ₹{
                    item.selectedOptions.reduce((optSum: number, optionId: string) => {
                      const option = item?.service?.options?.find((opt: any) => opt._id === optionId);
                      return optSum + (option?.price || 0);
                    }, 0) * item.quantity
                  }
                </span> */}
                <span>
                  ₹{
                    item.selectedOptions.reduce((optSum: number, optionId: string) => {
                      const option = item?.service?.options?.find((opt: any) => opt.id === optionId); // ✅
                      return optSum + (option?.price || 0);
                    }, 0) * item.quantity
                  }
                </span>

              </div>
            ))}
            <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Delivery Address
            </h2>
            {!deliveryAddress && (
              <span className="text-sm text-red-600 font-medium">Required</span>
            )}
          </div>
          
          {deliveryAddress ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium mb-1">Delivery Address:</p>
                  <p className="text-sm text-gray-600">{deliveryAddress.fullAddress}</p>
                  {deliveryInstructions && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 font-medium mb-1">Delivery Instructions:</p>
                      <p className="text-sm text-gray-600">{deliveryInstructions}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 ml-4"
                >
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Address Required</p>
                  <p className="text-sm text-yellow-700">Please add your delivery address to continue</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Add Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Instructions */}
        {deliveryAddress && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Instructions (Optional)</h2>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="Any special instructions for delivery (e.g., call before delivery, leave at gate, etc.)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-500 bg-green-50">
            <div className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-500">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                    <p className="text-sm text-gray-500">Pay with cash upon delivery</p>
                  </div>
                </div>
                <Check className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleProceed}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-white ${!isProcessing
              ? 'bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={handleAddressModalClose}
        onSave={handleAddressSave}
        initialAddress={deliveryAddress || undefined}
      />
    </div>
  );
}

export default PaymentPage;












