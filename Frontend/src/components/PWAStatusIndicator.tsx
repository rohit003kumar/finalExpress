import React from 'react';
import { usePWAStatus } from '../hooks/usePWAStatus';

const PWAStatusIndicator = () => {
  const {
    isInstalled,
    isStandalone,
    canInstall,
    isMobile,
    isAndroid,
    isIOS
  } = usePWAStatus();

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">🔍 PWA Status Debug</div>
      <div className="space-y-1">
        <div>📱 Mobile: {isMobile ? 'Yes' : 'No'}</div>
        <div>🤖 Android: {isAndroid ? 'Yes' : 'No'}</div>
        <div>🍎 iOS: {isIOS ? 'Yes' : 'No'}</div>
        <div>📱 Installed: {isInstalled ? 'Yes' : 'No'}</div>
        <div>🔄 Standalone: {isStandalone ? 'Yes' : 'No'}</div>
        <div>⬇️ Can Install: {canInstall ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

export default PWAStatusIndicator;
