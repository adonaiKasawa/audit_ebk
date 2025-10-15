"use server";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

import DeleteAccountPage from "../settings/delete.account.page";

import AccountLoginToDeleteAccount from "./login.page";

import { auth } from "@/auth";

export default async function Account() {
  const session = await auth();

  return (
    <div className="grid grid-cols-5">
      <div className="col-start-2 col-span-3">
        <Card>
          <CardHeader>
            <p className="text-2xl">Supprimer le compte</p>
          </CardHeader>
          <CardBody>
            {!session ? (
              <AccountLoginToDeleteAccount />
            ) : (
              <DeleteAccountPage initSession={session} />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
