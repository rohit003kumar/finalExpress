import { TimeSlot } from '../types';

// Base time slots template
const baseTimeSlots: Omit<TimeSlot, 'available' | 'isAvailable'>[] = [
  { id: 'morning-1', time: '09:00 - 10:00', period: 'Morning', total: 10 },
  { id: 'morning-2', time: '10:00 - 11:00', period: 'Morning', total: 10 },
  { id: 'morning-3', time: '11:00 - 12:00', period: 'Morning', total: 10 },
  { id: 'afternoon-1', time: '13:00 - 14:00', period: 'Afternoon', total: 10 },
  { id: 'afternoon-2', time: '14:00 - 15:00', period: 'Afternoon', total: 10 },
  { id: 'afternoon-3', time: '15:00 - 16:00', period: 'Afternoon', total: 10 },
  { id: 'evening-1', time: '16:00 - 17:00', period: 'Evening', total: 10 },
  { id: 'evening-2', time: '17:00 - 18:00', period: 'Evening', total: 10 }
];

// Generate unique availability based on date
export function generateTimeSlotsForDate(dateString: string): TimeSlot[] {
  const date = new Date(dateString);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  return baseTimeSlots.map((slot, index) => {
    // Create unique seed for each date and slot combination
    const dateSeed = dayOfYear * 1000 + dayOfWeek * 100 + index;
    
    // Use different algorithms for different days to ensure variety
    let available: number;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      // Weekends have different patterns - more availability in morning/evening
      const weekendPattern = [8, 6, 4, 3, 2, 5, 7, 9];
      available = Math.max(0, Math.min(10, weekendPattern[index] + Math.floor(Math.sin(dateSeed) * 3)));
    } else { // Weekday
      // Weekdays have different patterns - more availability in afternoon
      const weekdayPattern = [5, 7, 9, 8, 6, 4, 3, 2];
      available = Math.max(0, Math.min(10, weekdayPattern[index] + Math.floor(Math.sin(dateSeed) * 4)));
    }
    
    // Ensure each date has unique availability by using date-specific variations
    const dateVariation = Math.floor(Math.sin(dateSeed * 0.1) * 2);
    available = Math.max(0, Math.min(10, available + dateVariation));
    
    return {
      ...slot,
      available,
      isAvailable: available > 0
    };
  });
}

// Generate time slots for multiple dates (useful for weekly view)
export function generateTimeSlotsForWeek(startDate: string): Record<string, TimeSlot[]> {
  const slots: Record<string, TimeSlot[]> = {};
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    slots[dateString] = generateTimeSlotsForDate(dateString);
  }
  
  return slots;
}

// Generate time slots for a specific month
export function generateTimeSlotsForMonth(year: number, month: number): Record<string, TimeSlot[]> {
  const slots: Record<string, TimeSlot[]> = {};
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  for (let day = 1; day <= endDate.getDate(); day++) {
    const date = new Date(year, month - 1, day);
    const dateString = date.toISOString().split('T')[0];
    slots[dateString] = generateTimeSlotsForDate(dateString);
  }
  
  return slots;
}