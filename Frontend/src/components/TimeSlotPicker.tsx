



// import React, { useEffect, useState } from 'react';
// import axios from '../utilss/axios'; // Adjust the import path as necessary
// import { Clock } from 'lucide-react';

// export interface TimeSlot {
//   _id: string;
//   time: string;
//   period: string;
//   available: boolean;
//   maxOrders: number;
//   booked: number;
//   spotsLeft: number;
// }

// interface BackendSlot {
//   range: string;
//   label: string;
//   maxBookings: number;
//   booked: number;
//   _id: string;
// }

// interface TimeSlotPickerProps {
//   selectedDate: string;
//   selectedTimeSlot: TimeSlot | null;
//   onDateChange: (date: string) => void;
//   onTimeSlotSelect: (timeSlot: TimeSlot) => void;
// }

// export default function TimeSlotPicker({
//   selectedDate,
//   selectedTimeSlot,
//   onDateChange,
//   onTimeSlotSelect,
// }: TimeSlotPickerProps) {
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [washermanId, setWashermanId] = useState<string | null>(null);

//   // Load washermanId from localStorage cart
//   useEffect(() => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     if (cart.length > 0) {
//       const first = cart[0];
//       const id = first?.washermanId || first?.washerman?._id;
//       if (typeof id === 'string' && id.length === 24) {
//         setWashermanId(id);
//       } else {
//         console.warn('Invalid washerman ID in cart:', id);
//       }
//     }
//   }, []);

//   // Fetch available slots from backend
//   useEffect(() => {
//     const fetchSlots = async () => {
//       if (!washermanId || !selectedDate) return;

//       setLoading(true);
//       try {
//         const res = await axios.get('/api/show/available-slots', {
//           params: { washermanId, date: selectedDate },
//         });

//         const slotsFromBackend: BackendSlot[] = res.data.enabledSlots || [];

//         const transformed: TimeSlot[] = slotsFromBackend.map((slot) => {
//           const hour = parseInt(slot.range.split(':')[0], 10);
//           let period = 'Morning';
//           if (hour >= 12 && hour < 17) period = 'Afternoon';
//           else if (hour >= 17 || hour < 5) period = 'Evening';

//           const spotsLeft = slot.maxBookings - slot.booked;

//           return {
//             _id: slot.range,
//             time: slot.range,
//             period,
//             available: spotsLeft > 0,
//             maxOrders: slot.maxBookings,
//             booked: slot.booked,
//             spotsLeft,
//           };
//         });

//         setTimeSlots(transformed);
//       } catch (err) {
//         console.error('Error fetching time slots:', err);
//         setTimeSlots([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSlots();
//   }, [selectedDate, washermanId]);

//   const groupedSlots = timeSlots.reduce((acc, slot) => {
//     if (!acc[slot.period]) acc[slot.period] = [];
//     acc[slot.period].push(slot);
//     return acc;
//   }, {} as Record<string, TimeSlot[]>);

//   const getSlotColor = (slot: TimeSlot) => {
//     const isSelected = selectedTimeSlot && selectedTimeSlot._id === slot._id;
//     const isFull = slot.booked >= slot.maxOrders;

//     if (isSelected) return 'bg-blue-600 text-white border-blue-600';
//     if (isFull) return 'bg-red-500 text-white border-red-500 cursor-not-allowed';
//     return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//       <div className="flex items-center space-x-2 mb-6">
//         <Clock className="w-5 h-5 text-blue-600" />
//         <h2 className="text-lg md:text-xl font-semibold text-gray-900">Select Date and Time</h2>
//       </div>

//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => onDateChange(e.target.value)}
//           min={new Date().toISOString().split('T')[0]}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading slots...</p>
//       ) : (
//         <div className="space-y-6">
//           {Object.entries(groupedSlots).map(([period, slots]) => (
//             <div key={period}>
//               <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3">{period}</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {slots.map((slot) => (
//                   <button
//                     key={slot._id}
//                     onClick={() => slot.available && onTimeSlotSelect(slot)}
//                     disabled={!slot.available}
//                     className={`p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${getSlotColor(slot)}${selectedTimeSlot && selectedTimeSlot._id === slot._id ? ' ring-2 ring-blue-400' : ''}`}
//                   >
//                     <div className="text-center space-y-1">
//                       <div className="font-semibold text-sm md:text-base">{slot.time || 'No Time'}</div>
//                       <div className="text-xs text-gray-700">
//                         {slot.booked}/{slot.maxOrders} Orders
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//         <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">Legend</h4>
//         <div className="flex flex-wrap gap-4 text-xs md:text-sm">
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
//             <span>Available</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-red-500 rounded"></div>
//             <span>Full</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-blue-600 rounded"></div>
//             <span>Selected</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



















import React, { useEffect, useState } from 'react';
import axios from '../utilss/axios'; // Adjust the import path as necessary
import { Clock } from 'lucide-react';

export interface TimeSlot {
  _id: string;
  time: string;
  period: string;
  available: boolean;
  maxOrders: number;
  booked: number;
  spotsLeft: number;
}

interface BackendSlot {
  range: string;
  label: string;
  maxBookings: number;
  booked: number;
  _id: string;
}

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  onDateChange: (date: string) => void;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

export default function TimeSlotPicker({
  selectedDate,
  selectedTimeSlot,
  onDateChange,
  onTimeSlotSelect,
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [washermanId, setWashermanId] = useState<string | null>(null);

  // Load washermanId from localStorage cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length > 0) {
      const first = cart[0];
      const id = first?.washermanId || first?.washerman?._id;
      if (typeof id === 'string' && id.length === 24) {
        setWashermanId(id);
        
        // ✅ FIXED: Automatically refresh time slots when washermanId is set
        if (selectedDate) {
          const fetchSlots = async () => {
            setLoading(true);
            try {
              const res = await axios.get('/api/show/available-slots', {
                params: { 
                  washermanId: id, 
                  date: selectedDate,
                  _t: Date.now()
                },
              });
              const slotsFromBackend: BackendSlot[] = res.data.enabledSlots || [];
              const transformed: TimeSlot[] = slotsFromBackend.map((slot) => {
                const hour = parseInt(slot.range.split(':')[0], 10);
                let period = 'Morning';
                if (hour >= 12 && hour < 17) period = 'Afternoon';
                else if (hour >= 17 || hour < 5) period = 'Evening';
                const spotsLeft = slot.maxBookings - slot.booked;
                return {
                  _id: slot.range,
                  time: slot.range,
                  period,
                  available: spotsLeft > 0,
                  maxOrders: slot.maxBookings,
                  booked: slot.booked,
                  spotsLeft,
                };
              });
              setTimeSlots(transformed);
            } catch (err) {
              console.error('Error fetching time slots:', err);
              setTimeSlots([]);
            } finally {
              setLoading(false);
            }
          };
          fetchSlots();
        }
      } else {
        console.warn('Invalid washerman ID in cart:', id);
      }
    }
  }, [selectedDate]);

  // ✅ FIXED: Auto-refresh time slots when component mounts
  useEffect(() => {
    if (washermanId && selectedDate) {
      const fetchSlots = async () => {
        setLoading(true);
        try {
          const res = await axios.get('/api/show/available-slots', {
            params: { 
              washermanId, 
              date: selectedDate,
              _t: Date.now()
            },
          });
          const slotsFromBackend: BackendSlot[] = res.data.enabledSlots || [];
          const transformed: TimeSlot[] = slotsFromBackend.map((slot) => {
            const hour = parseInt(slot.range.split(':')[0], 10);
            let period = 'Morning';
            if (hour >= 12 && hour < 17) period = 'Afternoon';
            else if (hour >= 17 || hour < 5) period = 'Evening';
            const spotsLeft = slot.maxBookings - slot.booked;
            return {
              _id: slot.range,
              time: slot.range,
              period,
              available: spotsLeft > 0,
              maxOrders: slot.maxBookings,
              booked: slot.booked,
              spotsLeft,
            };
          });
          setTimeSlots(transformed);
        } catch (err) {
          console.error('Error fetching time slots:', err);
          setTimeSlots([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSlots();
    }
  }, []); // Run only once when component mounts

  // ✅ FIXED: Continuous refresh mechanism for real-time updates
  useEffect(() => {
    const fetchSlots = async () => {
      if (!washermanId || !selectedDate) return;

      setLoading(true);
      try {
        const res = await axios.get('/api/show/available-slots', {
          params: { 
            washermanId, 
            date: selectedDate,
            _t: Date.now()
          },
        });

        const slotsFromBackend: BackendSlot[] = res.data.enabledSlots || [];

        const transformed: TimeSlot[] = slotsFromBackend.map((slot) => {
          const hour = parseInt(slot.range.split(':')[0], 10);
          let period = 'Morning';
          if (hour >= 12 && hour < 17) period = 'Afternoon';
          else if (hour >= 17 || hour < 5) period = 'Evening';

          const spotsLeft = slot.maxBookings - slot.booked;

          return {
            _id: slot.range,
            time: slot.range,
            period,
            available: spotsLeft > 0,
            maxOrders: slot.maxBookings,
            booked: slot.booked,
            spotsLeft,
          };
        });

        setTimeSlots(transformed);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
    
    // ✅ FIXED: Add a refresh mechanism to ensure slots are updated
    const refreshInterval = setInterval(fetchSlots, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, [selectedDate, washermanId]);

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = [];
    acc[slot.period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const getSlotColor = (slot: TimeSlot) => {
    const isSelected = selectedTimeSlot && selectedTimeSlot._id === slot._id;
    const isFull = slot.booked >= slot.maxOrders;

    if (isSelected) return 'bg-blue-600 text-white border-blue-600';
    if (isFull) return 'bg-red-500 text-white border-red-500 cursor-not-allowed';
    return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Select Date and Time</h2>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            const fetchSlots = async () => {
              if (!washermanId || !selectedDate) return;
              try {
                const res = await axios.get('/api/show/available-slots', {
                  params: { 
                    washermanId, 
                    date: selectedDate,
                    _t: Date.now() // ✅ FIXED: Add cache-busting parameter
                  },
                });
                const slotsFromBackend: BackendSlot[] = res.data.enabledSlots || [];
                const transformed: TimeSlot[] = slotsFromBackend.map((slot) => {
                  const hour = parseInt(slot.range.split(':')[0], 10);
                  let period = 'Morning';
                  if (hour >= 12 && hour < 17) period = 'Afternoon';
                  else if (hour >= 17 || hour < 5) period = 'Evening';
                  const spotsLeft = slot.maxBookings - slot.booked;
                  return {
                    _id: slot.range,
                    time: slot.range,
                    period,
                    available: spotsLeft > 0,
                    maxOrders: slot.maxBookings,
                    booked: slot.booked,
                    spotsLeft,
                  };
                });
                setTimeSlots(transformed);
              } catch (err) {
                console.error('Error refreshing time slots:', err);
              } finally {
                setLoading(false);
              }
            };
            fetchSlots();
          }}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading slots...</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([period, slots]) => (
            <div key={period}>
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3">{period}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => slot.available && onTimeSlotSelect(slot)}
                    disabled={!slot.available}
                    className={`p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${getSlotColor(slot)}${selectedTimeSlot && selectedTimeSlot._id === slot._id ? ' ring-2 ring-blue-400' : ''}`}
                  >
                    <div className="text-center space-y-1">
                      <div className="font-semibold text-sm md:text-base">{slot.time || 'No Time'}</div>
                      <div className="text-xs text-gray-700">
                        {slot.booked}/{slot.maxOrders} Orders
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs md:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Full</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}






















