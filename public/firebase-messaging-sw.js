// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// This firebaseConfig must match the one in your `src/lib/firebase.ts` file.
const firebaseConfig = {
    apiKey: "AIzaSyDGGy_MHtFt-DsErVzmaduxyzw-SpoW5Cc",
    authDomain: "van-rakshak-cm009.firebaseapp.com",
    projectId: "van-rakshak-cm009",
    storageBucket: "van-rakshak-cm009.firebasestorage.app",
    messagingSenderId: "244996681126",
    appId: "1:244996681126:web:d3b3556f52ef3d0574f367"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico', // You can use a different icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});