import React, { useEffect, useRef } from 'react';
import axios from '../utilss/axios';

// Utility: generate next 10 dates starting from today (timezone-safe)
const generateNextNDates = (n: number): string[] => {
  const dates: string[] = [];
  const today = new Date();

  // Get today's date in local timezone
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  for (let i = 0; i < n; i++) {
    // Create new date for each iteration to avoid timezone issues
    const date = new Date(year, month, day + i);
    const dateString = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
    dates.push(dateString);
  }
  return dates;
};

// Utility: get today's date string in YYYY-MM-DD format
const getTodayString = (): string => {
  const today = new Date();
  return today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
};

interface BackgroundSlotGeneratorProps {
  isAdmin?: boolean;
}

const BackgroundSlotGenerator: React.FC<BackgroundSlotGeneratorProps> = ({ isAdmin = false }) => {
  const lastCheckRef = useRef<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);

  // Auto-generate templates for new dates
  const autoGenerateTemplatesForNewDates = async (newDates: string[]) => {
    if (isRunningRef.current) {
      console.log('Background slot generation already running, skipping...');
      return;
    }

    isRunningRef.current = true;
    
    try {
      console.log('🔄 Background: Checking for new dates that need templates...');
      
      // Check if user is logged in and is admin
      const token = localStorage.getItem("token");
      if (!token) {
        console.log('Background: No token found, skipping auto-generation');
        return;
      }

      // Get existing templates to see what dates already have templates
      const existingTemplatesRes = await axios.get("/api/slot-templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const existingTemplateDates = existingTemplatesRes.data.map((template: any) => template.date);
      const newDatesNeedingTemplates = newDates.filter(date => !existingTemplateDates.includes(date));
      
      if (newDatesNeedingTemplates.length === 0) {
        console.log('Background: All new dates already have templates');
        return;
      }
      
      console.log('Background: New dates needing templates:', newDatesNeedingTemplates);
      
      // Find the most recent template to use as a base
      const todayString = getTodayString();
      const mostRecentTemplate = existingTemplatesRes.data
        .filter((template: any) => template.date >= todayString)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      
      if (!mostRecentTemplate) {
        console.log('Background: No recent template found to copy from');
        return;
      }
      
      console.log('Background: Using template from', mostRecentTemplate.date, 'as base for new templates');
      
      // Auto-generate templates for new dates
      const autoGenRes = await axios.post(
        "/api/auto-generate-dates",
        { 
          templateDate: mostRecentTemplate.date, 
          numberOfDays: 10 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const successCount = autoGenRes.data.results.filter((r: any) => r.status === 'success').length;
      console.log(`Background: Auto-generated ${successCount} new templates`);
      
      if (successCount > 0) {
        // Show a subtle notification that new templates were generated
        console.log(`✅ Background: Auto-generated ${successCount} new templates for upcoming dates`);
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('slotTemplatesGenerated', {
          detail: { count: successCount, dates: newDatesNeedingTemplates }
        }));
      }
      
    } catch (error) {
      console.error('Background: Error auto-generating templates for new dates:', error);
    } finally {
      isRunningRef.current = false;
    }
  };

  // Check for date changes and auto-generate if needed
  const checkAndGenerateSlots = async () => {
    const currentTodayString = getTodayString();
    
    // Only run if today's date has changed since last check
    if (currentTodayString !== lastCheckRef.current) {
      console.log('Background: Date changed detected:', lastCheckRef.current, '->', currentTodayString);
      lastCheckRef.current = currentTodayString;
      
      const newDates = generateNextNDates(10);
      await autoGenerateTemplatesForNewDates(newDates);
    }
  };

  useEffect(() => {
    // Only run background generation for admin users
    if (!isAdmin) {
      return;
    }

    console.log('🚀 Background Slot Generator started for admin user');

    // Initial check
    lastCheckRef.current = getTodayString();
    const initialDates = generateNextNDates(10);
    autoGenerateTemplatesForNewDates(initialDates);

    // Set up interval to check every 5 minutes
    intervalRef.current = setInterval(() => {
      checkAndGenerateSlots();
    }, 5 * 60 * 1000); // 5 minutes

    // Also check when page becomes visible (user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Background: Page became visible, checking for updates...');
        checkAndGenerateSlots();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check when user focuses the window
    const handleFocus = () => {
      console.log('Background: Window focused, checking for updates...');
      checkAndGenerateSlots();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      console.log('🛑 Background Slot Generator stopped');
    };
  }, [isAdmin]);

  // This component doesn't render anything visible
  return null;
};

export default BackgroundSlotGenerator;
