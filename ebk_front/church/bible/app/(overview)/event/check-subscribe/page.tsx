import { redirect } from "next/navigation";

export default async function CheckSubscribe() {
  return redirect("/event");
}
