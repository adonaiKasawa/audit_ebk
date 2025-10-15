import React from "react";

import ClientPage from "./client.page";

import { getUserNotifications } from "@/app/lib/actions/notification/notif.req";

export default async function NotificationPage() {
  const notifications = await getUserNotifications();

  return (
    <div>
      <ClientPage notifications={notifications} />
    </div>
  );
}
