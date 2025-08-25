import React from 'react';
import './OrderStatusUpdater.css';
import './Dashboard.jsx';
const timeSlotOptions = [
  '6:00 AM', '9:00 AM', '12:00 PM',
  '3:00 PM', '6:00 PM', '9:00 PM',
];

const getTimeSlotRange = (startTime) => {
  const [time, modifier] = startTime.split(' ');
  let [hours] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  let endHours = (hours + 3) % 24;
  const endModifier = endHours >= 12 ? 'PM' : 'AM';
  if (endHours > 12) endHours -= 12;
  if (endHours === 0) endHours = 12;

  return `${startTime} - ${endHours}:00 ${endModifier}`;
};

const OrderStatusUpdater = ({ order, updateOrderStatus }) => {
  const { id, status, date, timeSlotStart, place } = order;

  return (
    <div className="order-actions">
      <div className="order-info">
        <p><strong>📅 Date:</strong> {date}</p>
        <p><strong>📍 Place:</strong> {place}</p>
        <label>
          <strong>⏰ Time Slot:</strong>{' '}
          <select disabled value={timeSlotStart}>
            {timeSlotOptions.map((slot, index) => (
              <option key={index} value={slot}>
                {getTimeSlotRange(slot)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {status === 'Assigned' && (
        <>
          <button
            onClick={() => updateOrderStatus(id, 'Accepted')}
            className="status-button green"
          >
            ✅ Accept
          </button>
          <button
            onClick={() => updateOrderStatus(id, 'Rejected')}
            className="status-button red"
          >
            ❌ Reject
          </button>
        </>
      )}

      {status === 'Accepted' && (
        <button
          onClick={() => updateOrderStatus(id, 'In Progress')}
          className="status-button blue"
        >
          🧼 Start Washing
        </button>
      )}

      {status === 'In Progress' && (
        <button
          onClick={() => updateOrderStatus(id, 'Ready for Delivery')}
          className="status-button orange"
        >
          📦 Mark Ready
        </button>
      )}

      {status === 'Ready for Delivery' && (
        <button
          onClick={() => updateOrderStatus(id, 'Delivered')}
          className="status-button green"
        >
          🚚 Mark Delivered
        </button>
      )}
    </div>
  );
};

export default OrderStatusUpdater;
