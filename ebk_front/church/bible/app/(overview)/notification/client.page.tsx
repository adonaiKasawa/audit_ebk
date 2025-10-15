"use client";
import React from "react";

import { NotificationContent } from "@/app/lib/config/interface";
import { NotificationItem } from "@/ui/notification/notification.ui";

export default function ClientPage({
  notifications,
}: {
  notifications: NotificationContent[];
}) {
  return (
    <div>
      <h1 className="text-3xl">Notification</h1>
      <div className="grid grid-cols-12 mt-4">
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          {notifications &&
            notifications.map((item: any, key: number) => {
              return <NotificationItem key={key} content={item} />;
            })}
        </div>
      </div>
    </div>
  );
}
