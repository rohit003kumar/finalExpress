import { useState, useEffect } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  deferredPrompt: any;
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  installPWA: () => Promise<void>;
  downloadAPK: () => void;
}

export const usePWAStatus = (): PWAStatus => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Device detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    const checkIfInstalled = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                              (window.navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneMode);
      
      // Check if app is installed by looking for specific PWA indicators
      const isInstalledPWA = isStandaloneMode || 
                            localStorage.getItem('pwa-installed') === 'true';
      
      setIsInstalled(isInstalledPWA);
    };

    // Check immediately
    checkIfInstalled();

    // Listen for beforeinstallprompt event (PWA install prompt)
    const handleBeforeInstallPrompt = (e: any) => {
      console.log("✅ beforeinstallprompt fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log("✅ App was installed");
      setIsInstalled(true);
      setCanInstall(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check again after a short delay to ensure all checks are complete
    const timer = setTimeout(checkIfInstalled, 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      throw new Error("PWA install prompt not available");
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("✅ User accepted the PWA install");
      setIsInstalled(true);
      setCanInstall(false);
      localStorage.setItem('pwa-installed', 'true');
    } else {
      console.log("❌ User dismissed the PWA install");
    }

    setDeferredPrompt(null);
  };

  const downloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/app-debug.apk';
    link.download = 'DhobiXpress.apk';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    isInstalled,
    isStandalone,
    canInstall,
    deferredPrompt,
    isMobile,
    isAndroid,
    isIOS,
    installPWA,
    downloadAPK
  };
};
