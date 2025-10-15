import { getTodayAudioHistoriqueApi } from "@/app/lib/actions/views/views.req";
import { auth } from "@/auth";
import HistoriqueAudiosClient from "./client.page";

export default async function HistoriquePage() {
  const session = await auth();
  const historiquesRaw = await getTodayAudioHistoriqueApi();
  console.log("historiquesRaw =", historiquesRaw);


  const historiques = historiquesRaw
    .map((item: any) => item.audio)
    .filter(Boolean);

  return (
    <HistoriqueAudiosClient
      session={session}
      historiques={historiques}
    />
  );
}
