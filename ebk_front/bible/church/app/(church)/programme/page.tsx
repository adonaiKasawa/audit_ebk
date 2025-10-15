import { redirect } from "next/navigation";

import ListProgramme from "./list.prog";

import { findProgrammeByChurchIdApi } from "@/app/lib/actions/programme/prog.res";
import { auth } from "@/auth";

export default async function Programme() {
  const session = await auth();

  if (!session) {
    redirect("/church");
  }
  const find = await findProgrammeByChurchIdApi(session.user.eglise.id_eglise);

  return (
    <div>
      <ListProgramme programmes={find} />
    </div>
  );
}
