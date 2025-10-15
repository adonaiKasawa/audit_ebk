import { redirect } from "next/navigation";

import { ListeBook } from "./list.book";

import { auth } from "@/auth";
import { findFilesByChurchPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function Book() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const book = await findFilesByChurchPaginatedApi(
    TypeContentEnum.livres,
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListeBook book={book} session={session} />
    </div>
  );
}
