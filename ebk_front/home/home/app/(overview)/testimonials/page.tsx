import { redirect } from "next/navigation";

import ListeTestmonials from "./list.testimonials";

import { auth } from "@/auth";
import { findFilesByChurchPaginatedApi, findTestimonialsPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function Testimonials() {
  const session = await auth();


  const testmonials = await findTestimonialsPaginatedApi(
    1
  );
  // const testmonials = await findFilesByChurchPaginatedApi(
  //   TypeContentEnum.testimonials,
  //   session.user.eglise.id_eglise,
  // );
  // console.log(testmonialss);
  

  return (
    <div>
      <ListeTestmonials initData={testmonials} session={session ?? undefined} />
    </div>
  );
}
