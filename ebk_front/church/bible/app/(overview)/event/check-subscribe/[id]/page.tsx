import React from "react";

import EventByIdClientPage from "./page.client";

export default async function EventByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EventByIdClientPage params={await params} />;
}
