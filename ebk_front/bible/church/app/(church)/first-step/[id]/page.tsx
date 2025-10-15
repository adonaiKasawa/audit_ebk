"use server";

import React from "react";

import PageFirstStepByIdVideo from "./page.client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PageFirstStepByIdVideo params={await params} />;
}
