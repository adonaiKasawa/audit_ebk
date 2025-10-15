"use server";
import React from "react";

import { findChurchPaginatedApi } from "../../lib/actions/church/church";

import ListChurchClientPage from "./client.page";

export default async function Page() {
  const eglise = await findChurchPaginatedApi();
  
  return (
    <div>
      <ListChurchClientPage initData={eglise} />
    </div>
  );
}
