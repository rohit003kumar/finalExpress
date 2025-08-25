



import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check, ArrowLeft, Shield, Copy } from 'lucide-react';
// import axios from 'axios'
import Swal from 'sweetalert2';
import axios from '/utilss/axios';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};

  // Safer fallback logic
  let productId = state.productId;
  let pickupDate = state.pickupDate;
  let pickupTimeSlot = state.pickupTimeSlot;
  let quantity = state.quantity;

  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!productId && cart.length > 0) {
      productId = cart[0]?.productId;
    }
  } catch (err) {
    console.error('Invalid cart in localStorage', err);
  }

  try {
    if (!pickupTimeSlot) {
      pickupTimeSlot = JSON.parse(localStorage.getItem('selectedTimeSlot') || 'null');
    }
  } catch (err) {
    console.error('Invalid selectedTimeSlot in localStorage', err);
  }

  if (!pickupDate) {
    pickupDate = localStorage.getItem('selectedDate');
  }

  if (!quantity) {
    const raw = localStorage.getItem('quantity');
    quantity = raw ? parseInt(raw) : 1;
  }

  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [copied, setCopied] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(49);
  const [total, setTotal] = useState(0);

  const merchantUpiId = 'merchant@paytm';

  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/booking/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { deliveryFee, total } = res.data;
        setDeliveryFee(deliveryFee);
        setTotal(total);
      } catch (error) {
        console.error('Failed to fetch order summary:', error);
      }
    };

    fetchOrderSummary();

    if (!productId || !pickupDate || !pickupTimeSlot || Number.isNaN(quantity) || quantity < 1) {
      Swal.fire('Error', 'Missing or invalid booking information.', 'error').then(() => {
        navigate('/cart');
      });
    }
  }, []);

  const handlePaymentSelect = (method: string) => setSelectedMethod(method);

  const handleProceed = async () => {
    if (!productId || !pickupDate || !pickupTimeSlot || Number.isNaN(quantity) || quantity < 1) {
      Swal.fire('Error', 'Incomplete booking data.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `/api/booking/create/${productId}`,
        {
          totalAmount: total,
          slot: pickupTimeSlot,
          pickupDate,
          quantity,
          paymentMethod: selectedMethod,
          upiProvider: selectedMethod === 'upi' ? upiId : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (selectedMethod === 'upi') {
        Swal.fire('Success', `UPI Payment initiated from: ${upiId}`, 'success');
      } else {
        Swal.fire('Order Placed', 'Cash on Delivery confirmed!', 'success');
      }

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

  const copyUpiId = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <p className="text-sm text-gray-500">Choose your preferred payment method</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 border-t pt-3">
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {/* UPI Method */}
          <div className={`bg-white rounded-2xl shadow-sm border-2 cursor-pointer ${selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`} onClick={() => handlePaymentSelect('upi')}>
            <div className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${selectedMethod === 'upi' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                    <CreditCard className={`w-6 h-6 ${selectedMethod === 'upi' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                    <p className="text-sm text-gray-500">Pay instantly using your UPI ID</p>
                  </div>
                </div>
                {selectedMethod === 'upi' && <Check className="w-5 h-5 text-blue-600" />}
              </div>

              {selectedMethod === 'upi' && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pay to UPI ID:</label>
                    <div className="flex items-center p-3 bg-gray-50 border rounded-lg">
                      <span className="flex-1 font-mono text-sm">{merchantUpiId}</span>
                      <button onClick={copyUpiId} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied && <p className="text-xs text-green-600 mt-1">UPI ID copied!</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your UPI ID:</label>
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@paytm" className="w-full p-3 border rounded-lg" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COD Method */}
          <div className={`bg-white rounded-2xl shadow-sm border-2 cursor-pointer ${selectedMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-100'}`} onClick={() => handlePaymentSelect('cod')}>
            <div className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${selectedMethod === 'cod' ? 'bg-green-500' : 'bg-gray-100'}`}>
                    <Truck className={`w-6 h-6 ${selectedMethod === 'cod' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                    <p className="text-sm text-gray-500">Pay with cash on delivery</p>
                  </div>
                </div>
                {selectedMethod === 'cod' && <Check className="w-5 h-5 text-green-600" />}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleProceed}
          disabled={!selectedMethod || isProcessing || (selectedMethod === 'upi' && !upiId.trim())}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-white ${selectedMethod && !isProcessing ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {isProcessing ? 'Processing...' : `Proceed to ${selectedMethod === 'upi' ? 'UPI Payment' : 'Place Order'}`}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
