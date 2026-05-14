importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCSK0q0NE4SCJop_-e9RJ9YvOFxGfQOxAk",
  authDomain: "app-familia-2ebff.firebaseapp.com",
  projectId: "app-familia-2ebff",
  storageBucket: "app-familia-2ebff.firebasestorage.app",
  messagingSenderId: "675531086251",
  appId: "1:675531086251:web:4ed44dec0d7c032e6d5aee"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const {title, body} = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  });
});
