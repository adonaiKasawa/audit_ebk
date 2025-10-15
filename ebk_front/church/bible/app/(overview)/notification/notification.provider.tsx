"use client";

import React, { useEffect } from "react";
// import { onMessage } from "firebase/messaging";

// import { messaging } from "./firebase";

// import { useToast } from "@/components/ui/use-toast";

export default function NotificationSetup() {
  // const { toast } = useToast();

  // const handleAddEventListener = () => {
  //   if (messaging) {
  //     onMessage(messaging, (payload: any) => {
  //       // console.log("Foreground Message:", payload);
  //       toast({
  //         title: payload?.notification?.title,
  //         description: payload.notification.body,
  //       });
  //     });
  //   }
  // };

  // const handleAddServiceWorker = () => {
  //   if ("serviceWorker" in navigator) {
  //     console.log("in serviceWorker");

  //     navigator.serviceWorker.register("/firebase-messaging-sw.js")
  //       .then((e) => {
  //         console.log("service worker registration succefully", e)
  //       })
  //       .catch((error) => {
  //         console.error("service worker registration failed", error)
  //       });

  //     // navigator.serviceWorker.addEventListener("message", event => {
  //     //   console.log("message in worker");
  //     //   console.log(event.data);

  //     //   // toast({
  //     //   //   title: event.data.notification.title,
  //     //   //   description: event.data.notification.body,
  //     //   // })
  //     // });
  //   }
  // }

  useEffect(() => {
    if (typeof window !== "undefined") {
      // console.log('Côté client');
      // setupNotifications();
      // handleAddEventListener();
      // handleAddServiceWorker()
    }
  });

  return <div />;
}
