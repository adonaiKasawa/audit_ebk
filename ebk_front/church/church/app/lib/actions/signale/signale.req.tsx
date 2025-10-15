"use server";

import { HttpRequest } from "../../request/request";
import { TypeContentEnum } from "@/app/lib/config/enum";

/**
 * Crée un signalement pour un contenu spécifique
 * @param typeContent - Le type de contenu (videos, audios, livres, etc.)
 * @param contentId - L'identifiant du contenu
 * @param commentaire - La raison du signalement
 */
export const createSignaleApi = async (
  typeContent: TypeContentEnum,
  contentId: number,
  commentaire: string = "Contenu inapproprié"
) => {
  return await HttpRequest(
    `signale/${typeContent}/${contentId}`,
    "POST",
    { commentaire }
  );
};
