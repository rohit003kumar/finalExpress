import React from 'react';
import OrderStatusUpdater from './orderStatusUpdater';

const AssignedOrders = ({ orders, updateOrderStatus }) => {
  return (
    <div className="orders-section" style={{ marginTop: 20 }}>
      <h3>🧺 Assigned Orders</h3>
      {orders.length === 0 ? (
        <p>No orders assigned.</p>
      ) : (
        orders.map(order => (
          <div
            className="order-card"
            key={order.id}
            style={{
              background: '#fafafa',
              border: '1px solid #ccc',
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            <h4>Order ID: {order.id}</h4>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Items:</strong> {order.items.join(', ')}</p>
            <p><strong>Express:</strong> {order.express ? 'Yes' : 'No'}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <OrderStatusUpdater order={order} updateOrderStatus={updateOrderStatus} />
          </div>
        ))
      )}
    </div>
  );
};

export default AssignedOrders;
