"use client";

import { initializeApp } from "firebase/app";
import { Messaging, getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDX-HvqZi_wd3MUw1mytgpAps28JJO_yNk",
  authDomain: "ecclesiabook-87200.firebaseapp.com",
  projectId: "ecclesiabook-87200",
  storageBucket: "ecclesiabook-87200.appspot.com",
  messagingSenderId: "1091370455595",
  appId: "1:1091370455595:web:a1f7e8a1e7a3a4ca25d06e",
};
let messaging: Messaging | undefined;

if (typeof window !== "undefined") {
  const firebaseApp = initializeApp(firebaseConfig);

  messaging = getMessaging(firebaseApp);
}

const setupNotifications = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // console.log("Notification permission granted.");
      if (messaging) {
        // const token = await getToken(messaging, {
        //   vapidKey:
        //     "BJAsIZGhizGx-NS_9735PU82sXFuINXfUr_qNZ5DoH1VvAkondLvf59sZUZZA1K1fvIgrYolw3Sp1UwqrGnlWQ8",
        // });
        // await sendTokenNotification(token);
        // console.log("FCM Token:", token);
      }
    } else {
    }
  } finally {
  }
};

export { messaging, setupNotifications };
