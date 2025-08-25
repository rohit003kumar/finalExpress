import React, { useState, useEffect } from 'react';
import { MapPin, User, Phone, Mail, Navigation, Clock, Package } from 'lucide-react';
import { apiFetch } from '../utilss/apifetch';
import { toast } from 'react-hot-toast';

interface CustomerAddress {
  _id: string;
  customer: {
    _id: string;
    name: string;
    phone?: string;
    email: string;
  };
  deliveryAddress: {
    houseNo: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  deliveryInstructions?: string;
  status: string;
  createdAt: string;
}

export default function WashermanAddressView() {
  const [orders, setOrders] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomerAddress | null>(null);

  useEffect(() => {
    fetchOrdersWithAddresses();
  }, []);

  const fetchOrdersWithAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view addresses');
        return;
      }

      const response = await apiFetch('/api/washerman/orders-with-addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders with addresses:', error);
      toast.error('Failed to load orders with addresses');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (coordinates: { lat: number; lng: number }) => {
    const { lat, lng } = coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const openInGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-blue-600" />
            Customer Delivery Addresses
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage customer delivery addresses for your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders with addresses</h3>
            <p className="text-gray-600">Orders with delivery addresses will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedOrder?._id === order._id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.customer.name}</h3>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p className="truncate">{order.deliveryAddress.fullAddress}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Address Details</h2>
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Customer Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-900 font-medium">{selectedOrder.customer.name}</p>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{selectedOrder.customer.email}</span>
                      </div>
                      {selectedOrder.customer.phone && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{selectedOrder.customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Delivery Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-gray-900">
                        <span className="font-medium">House/Flat:</span> {selectedOrder.deliveryAddress.houseNo}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-medium">Street:</span> {selectedOrder.deliveryAddress.street}
                      </p>
                      {selectedOrder.deliveryAddress.landmark && (
                        <p className="text-gray-900">
                          <span className="font-medium">Landmark:</span> {selectedOrder.deliveryAddress.landmark}
                        </p>
                      )}
                      <p className="text-gray-900">
                        <span className="font-medium">City:</span> {selectedOrder.deliveryAddress.city}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-medium">State:</span> {selectedOrder.deliveryAddress.state}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-medium">Pincode:</span> {selectedOrder.deliveryAddress.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  {selectedOrder.deliveryInstructions && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Instructions</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-900">{selectedOrder.deliveryInstructions}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {selectedOrder.deliveryAddress.coordinates ? (
                      <button
                        onClick={() => openInMaps(selectedOrder.deliveryAddress.coordinates!)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Open in Maps (GPS)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openInGoogleMaps(selectedOrder.deliveryAddress.fullAddress)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Open in Google Maps</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select an order to view address details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




