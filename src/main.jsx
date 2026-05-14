import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Registrar service worker para notificaciones
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(reg => console.log('SW registrado:', reg.scope))
    .catch(err => console.log('SW error:', err));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
