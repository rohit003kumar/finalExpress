# Smart Download Button System

This system provides intelligent download buttons that automatically show/hide based on whether the PWA is already installed on the user's device.

## Features

### 🎯 Smart Detection
- **PWA Installation Status**: Detects if the app is already installed as a PWA
- **Standalone Mode**: Checks if running in standalone mode (installed PWA)
- **Device Detection**: Automatically detects Android, iOS, and other mobile devices
- **Installation Capability**: Determines if PWA installation is available

### 📱 Multiple Download Options
- **PWA Install Button**: Shows when PWA installation is available
- **Android APK Download**: Shows for Android devices or when PWA not available
- **iOS Instructions**: Shows manual installation steps for iOS devices

### 🔄 Automatic State Management
- **Button Visibility**: Automatically hides when app is installed
- **Real-time Updates**: Responds to installation events in real-time
- **Persistent State**: Remembers installation status across sessions

## How It Works

### 1. Installation Detection
```typescript
// Checks multiple indicators:
- display-mode: standalone (CSS media query)
- navigator.standalone (iOS Safari)
- localStorage flag (user's choice)
- beforeinstallprompt event (PWA capability)
```

### 2. Event Handling
```typescript
// Listens for key events:
- beforeinstallprompt: When PWA can be installed
- appinstalled: When PWA installation completes
- User interactions: Clicks, scrolls, etc.
```

### 3. Smart Button Logic
```typescript
if (isInstalled) {
  return null; // Hide button
} else if (canInstallPWA) {
  showPWAButton(); // Show PWA install
} else if (isAndroid) {
  showAPKButton(); // Show APK download
} else if (isIOS) {
  showIOSInstructions(); // Show manual steps
}
```

## Components

### InstallPWAButton
Main component that renders the appropriate download option based on device and installation status.

### usePWAStatus Hook
Custom hook that provides all PWA-related state and functions:
- `isInstalled`: Whether the app is currently installed
- `canInstall`: Whether PWA installation is available
- `isAndroid/isIOS`: Device type detection
- `installPWA()`: Function to trigger PWA installation
- `downloadAPK()`: Function to download Android APK

### PWAStatusIndicator
Debug component (development only) that shows current PWA status for testing.

## Usage

### Basic Implementation
```tsx
import InstallPWAButton from './components/InstallPWAButton';

function MyComponent() {
  return (
    <div>
      <InstallPWAButton />
    </div>
  );
}
```

### Advanced Usage with Hook
```tsx
import { usePWAStatus } from './hooks/usePWAStatus';

function MyComponent() {
  const { isInstalled, canInstall, installPWA } = usePWAStatus();
  
  if (isInstalled) {
    return <div>App is already installed! 🎉</div>;
  }
  
  return (
    <div>
      {canInstall && (
        <button onClick={installPWA}>
          Install PWA
        </button>
      )}
    </div>
  );
}
```

## Browser Support

### ✅ Supported
- Chrome/Edge (PWA + APK)
- Firefox (PWA + APK)
- Safari (iOS manual install)
- Samsung Internet (PWA + APK)

### ⚠️ Limited Support
- iOS Safari (manual installation only)
- Older browsers (APK download only)

## Testing

### Development Mode
The `PWAStatusIndicator` component shows real-time status in development:
- Device detection results
- Installation status
- PWA capability
- Standalone mode status

### Production Mode
Debug indicators are automatically hidden in production builds.

## File Structure

```
src/
├── components/
│   ├── InstallPWAButton.tsx      # Main download button
│   └── PWAStatusIndicator.tsx    # Debug indicator
├── hooks/
│   └── usePWAStatus.ts           # PWA status hook
└── App.tsx                       # Main app with debug indicator
```

## Troubleshooting

### Button Not Showing
1. Check if app is already installed
2. Verify PWA manifest configuration
3. Ensure HTTPS is enabled (required for PWA)
4. Check browser console for errors

### PWA Install Not Working
1. Verify `beforeinstallprompt` event is firing
2. Check PWA manifest validity
3. Ensure service worker is registered
4. Test on supported browsers

### APK Download Issues
1. Verify `/app-debug.apk` file exists
2. Check file permissions
3. Test on Android devices
4. Verify download path in hook

## Future Enhancements

- [ ] Offline detection
- [ ] Update notifications
- [ ] Installation progress tracking
- [ ] Cross-device sync
- [ ] Analytics integration
