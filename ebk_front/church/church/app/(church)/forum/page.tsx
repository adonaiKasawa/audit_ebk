import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";

import { ListBoxForum } from "@/ui/lisbox";
import { findForumByChurchId } from "@/app/lib/actions/church/church";
import { auth } from "@/auth";

export default async function forum() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");

    return null;
  }
  const find = await findForumByChurchId(session?.user.eglise.id_eglise);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl">Forum</h1>
        <Button as={Link} href="/forum/create">
          Créer un forum
        </Button>
      </div>
      <div className="grid grid-cols-12 mt-4">
        <div className="col-span-4">
          <h1>Liste de forum...</h1>
          <Divider />
          <div className="mt-4">
            {find.items && find.items.length > 0 ? (
              <ListBoxForum forum={find?.items} />
            ) : (
              <div className="flex justify-center items-center bg-blue-500">
                <h1>Vous n&#39;avez pas de forum!</h1>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3" />
        <div className="col-span-6" />
      </div>
    </div>
  );
}
