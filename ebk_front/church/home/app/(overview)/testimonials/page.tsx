import { redirect } from "next/navigation";

import ListeTestmonials from "./list.testimonials";

import { auth } from "@/auth";
import { findFilesByChurchPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function Testimonials() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const testmonials = await findFilesByChurchPaginatedApi(
    TypeContentEnum.testimonials,
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListeTestmonials initData={testmonials} session={session} />
    </div>
  );
}
