"use server";

import { HttpRequest } from "../../request/request";
import { TypeContentEnum } from "@/app/lib/config/enum";

/**
 * Enregistre une vue pour une vidéo spécifique
 * @param videoId - L'identifiant de la vidéo
 */
export const createVideoViewApi = async (videoId: number) => {
  return await HttpRequest(`views/${videoId}?files=${TypeContentEnum.videos}`, "POST");
};

// Similaire à la vidéo mais avec files=audios
export const createAudioViewApi = async (audioId: number) => {
  return await HttpRequest(`views/${audioId}?files=${TypeContentEnum.audios}`, "POST");
};

/**
 * Enregistre l'historique d'écoute d'un audio
 * @param audioId - L'identifiant de l'audio
 */
export const createAudioHistoriqueApi = async (audioId: number) => {
  return await HttpRequest(`historique/${audioId}?files=${TypeContentEnum.audios}`, "POST");
};

export const getTodayAudioHistoriqueApi = async () => {
  return await HttpRequest(`historique`, "GET");
};


