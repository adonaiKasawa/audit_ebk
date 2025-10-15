importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDX-HvqZi_wd3MUw1mytgpAps28JJO_yNk",
  authDomain: "ecclesiabook-87200.firebaseapp.com",
  projectId: "ecclesiabook-87200",
  storageBucket: "ecclesiabook-87200.appspot.com",
  messagingSenderId: "1091370455595",
  appId: "1:1091370455595:web:a1f7e8a1e7a3a4ca25d06e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/ecclessia.png",
    image: payload.data.image
  }
  
  let e = await self.registration.showNotification(notificationTitle, notificationOptions);
  console.log(e);
});

// self.addEventListener("message", event => {
//   const { type, data } = event.data;
//   console.log(type)
//   if (type === "showNotification") {
//     const { title, body } = data;
//     self.registration.showNotification(title, {
//       body: body,
//       icon: './ecclesia.png'
//     })
//     self.registration.showNotification(title);
//   }
// });