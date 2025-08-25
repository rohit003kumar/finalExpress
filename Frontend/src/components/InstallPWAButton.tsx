"use client";

import React from "react";
import { usePWAStatus } from "../hooks/usePWAStatus";

const InstallPWAButton = () => {
  const {
    isInstalled,
    canInstall,
    isAndroid,
    isIOS,
    installPWA,
    downloadAPK
  } = usePWAStatus();

  // Don't show button if app is already installed
  if (isInstalled) {
    return null;
  }

  const handlePWAInstall = async () => {
    try {
      await installPWA();
    } catch (error) {
      alert("PWA install not available. You can download the Android APK instead.");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* PWA Install Button - Show only if PWA install is available */}
      {canInstall && (
        <button
          onClick={handlePWAInstall}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          📱 Install PWA
        </button>
      )}
      
      {/* APK Download Button - Show for Android devices or when PWA not available */}
      {(isAndroid || !canInstall) && (
        <button
          onClick={downloadAPK}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          📲 Download Android App
        </button>
      )}
      
      {/* iOS Instructions - Show for iOS devices */}
      {isIOS && !canInstall && (
        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
          📱 Tap Share → Add to Home Screen to install
        </div>
      )}
    </div>
  );
};

export default InstallPWAButton;




