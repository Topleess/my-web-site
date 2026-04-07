import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './src/i18n'; // Инициализация i18n

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div style={{background:'#000',width:'100vw',height:'100vh'}}/>}>
      <App />
      <Analytics />
    </React.Suspense>
  </React.StrictMode>
);