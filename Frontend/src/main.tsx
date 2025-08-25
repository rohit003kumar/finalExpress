// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.tsx';
// import './index.css';


// // Register the PWA Service Worker
// import { registerSW } from 'virtual:pwa-register';
// registerSW({ immediate: true });


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// );










import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Register the Service Worker for PWA support
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true }); // Optional: Set `onNeedRefresh`, `onOfflineReady` for UX prompts

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
