

import React, { useEffect, useState } from 'react';
import { Order } from '../types/order';
import Navbar from '../components/Navbar';
import OrderCard from '../components/OrderCard';
import OrderSkeleton from '../components/OrderSkeleton';
// import { getEnhancedMockOrders } from '../data/mockOrders';
import { ShoppingBag } from 'lucide-react';
import axios from '../utilss/axios'; // Adjust the import path as necessary

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axios.get("/api/booking", {
  //         withCredentials: true,
  //       });
  //       console.log("Fetched orders:", res.data);
  //       setOrders(res.data); // Make sure response is an array
  //     } catch (error) {
  //       console.error("Error fetching orders:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, []);


  useEffect(() => {
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ✅ get token
      const res = await axios.get("/api/booking", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ pass token
        },
        withCredentials: true, // ✅ keep if backend needs cookies
      });
      console.log("Fetched orders:", res.data);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);



  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <ShoppingBag className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          </div>
          <p className="text-gray-600">View and track all your previous orders</p>
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <OrderSkeleton key={i} />
              ))}
            </>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
              <p className="text-gray-500">You haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
