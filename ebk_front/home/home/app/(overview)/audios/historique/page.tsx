import { getTodayAudioHistoriqueApi } from "@/app/lib/actions/views/views.req";
import { auth } from "@/auth";
import HistoriqueAudiosClient from "./client.page";

export default async function HistoriquePage() {
  const session = await auth();
  const { data: historiquesRaw } = await getTodayAudioHistoriqueApi();
  console.log("historiquesRaw =", historiquesRaw);

  const historiques = Array.isArray(historiquesRaw)
    ? historiquesRaw.map((item: any) => item.audio).filter(Boolean)
    : [];

  return <HistoriqueAudiosClient historiques={historiques} session={session} />;
}
