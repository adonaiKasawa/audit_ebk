import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDX-HvqZi_wd3MUw1mytgpAps28JJO_yNk",
  authDomain: "ecclesiabook-87200.firebaseapp.com",
  projectId: "ecclesiabook-87200",
  storageBucket: "ecclesiabook-87200.appspot.com",
  messagingSenderId: "1091370455595",
  appId: "1:1091370455595:web:a1f7e8a1e7a3a4ca25d06e",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging();

export const vapidKey = "G3G5mVe52gg4Q8iNE0UKW2sp5gWtiFNkr9rSufOrz0Q";
