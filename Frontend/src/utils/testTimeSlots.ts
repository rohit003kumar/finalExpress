import { generateTimeSlotsForDate, generateTimeSlotsForWeek, generateTimeSlotsForMonth } from './timeSlots';

// Test function to verify daily slot uniqueness
export function testDailySlotGeneration() {
  console.log('🧪 Testing Daily Time Slot Generation...\n');

  // Test 1: Generate slots for different dates
  const dates = [
    '2025-01-01', // Wednesday
    '2025-01-02', // Thursday
    '2025-01-03', // Friday
    '2025-01-04', // Saturday
    '2025-01-05', // Sunday
    '2025-01-06', // Monday
    '2025-01-07', // Tuesday
  ];

  const allSlots: Record<string, any[]> = {};

  dates.forEach(date => {
    const slots = generateTimeSlotsForDate(date);
    allSlots[date] = slots;
    
    console.log(`📅 ${date} (${new Date(date).toLocaleDateString('en-US', { weekday: 'long' })})`);
    slots.forEach(slot => {
      console.log(`   ${slot.time} - ${slot.period}: ${slot.available}/${slot.total} available`);
    });
    console.log('');
  });

  // Test 2: Check for uniqueness
  const availabilityPatterns = dates.map(date => 
    allSlots[date].map(slot => slot.available)
  );

  console.log('🔍 Checking for uniqueness...');
  let hasDuplicates = false;
  
  for (let i = 0; i < availabilityPatterns.length; i++) {
    for (let j = i + 1; j < availabilityPatterns.length; j++) {
      const pattern1 = availabilityPatterns[i];
      const pattern2 = availabilityPatterns[j];
      
      if (JSON.stringify(pattern1) === JSON.stringify(pattern2)) {
        console.log(`❌ Duplicate pattern found between ${dates[i]} and ${dates[j]}`);
        hasDuplicates = true;
      }
    }
  }

  if (!hasDuplicates) {
    console.log('✅ All dates have unique availability patterns!');
  }

  // Test 3: Generate weekly slots
  console.log('\n📅 Testing weekly generation...');
  const weeklySlots = generateTimeSlotsForWeek('2025-01-01');
  console.log(`Generated ${Object.keys(weeklySlots).length} days of slots`);

  // Test 4: Generate monthly slots
  console.log('\n📅 Testing monthly generation...');
  const monthlySlots = generateTimeSlotsForMonth(2025, 1);
  console.log(`Generated ${Object.keys(monthlySlots).length} days of slots for January 2025`);

  return {
    success: !hasDuplicates,
    totalDates: dates.length,
    weeklySlots: Object.keys(weeklySlots).length,
    monthlySlots: Object.keys(monthlySlots).length
  };
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testDailySlotGeneration = testDailySlotGeneration;
}
