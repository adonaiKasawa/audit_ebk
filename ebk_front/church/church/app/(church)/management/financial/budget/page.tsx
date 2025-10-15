import React from "react";
import { redirect } from "next/navigation";

import ManangmentBubgetPageClient from "./page.client";

import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import {
  findManagementBudgetByEgliseIdApi,
  findManagementExpensesByEgliseIdApi,
} from "@/app/lib/actions/management/finance/finance.req";

export default async function ManangmentBubgetPage() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/api/auth/signin");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const find = await findManagementBudgetByEgliseIdApi(id_eglise);
  const depenses = await findManagementExpensesByEgliseIdApi(id_eglise);

  return (
    <ManangmentBubgetPageClient
      initData={{ budget: find, depenses }}
      session={session}
    />
  );
}
