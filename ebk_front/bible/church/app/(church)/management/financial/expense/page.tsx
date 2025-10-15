import React from "react";
import { redirect } from "next/navigation";

import ManangmentIncomePageClient from "./page.client";

import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { findManagementExpensesByEgliseIdApi } from "@/app/lib/actions/management/finance/finance.req";

export default async function ManangmentIncomePage() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/api/auth/signin");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const find = await findManagementExpensesByEgliseIdApi(id_eglise);

  return <ManangmentIncomePageClient initData={find} session={session} />;
}
