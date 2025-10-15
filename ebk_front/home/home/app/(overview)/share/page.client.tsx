"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Session } from "next-auth";

import VideosPlayer from "../videos/[id]/videos.player";
import ClietAudiosPage from "../audios/[id]/client.page";
import { PictureClietPage } from "../pictures/[id]/client.page";
import ClientBookPage from "../book/[id]/client.page";

import Notfound from "@/app/not-found";
import { TypeContentEnum } from "@/app/lib/config/enum";
import {
  CreateShareApi,
  CreateShareNoGaurdApi,
} from "@/app/lib/actions/share/share.req";

export const SharePageClient = ({ session }: { session: Session | null }) => {
  const searchParams = useSearchParams();
  const s_share_code = searchParams.get("s_share_code");
  const u_user = searchParams.get("u_user");
  const t_type_file = searchParams.get("t_type_file");

  const [content, setContet] = useState<any>();

  const getShareView = useCallback(async () => {
    let share = session
      ? await CreateShareApi(s_share_code, u_user, t_type_file)
      : await CreateShareNoGaurdApi(s_share_code, u_user, t_type_file);

    if (
      !share.hasOwnProperty("statusCode") &&
      !share.hasOwnProperty("message")
    ) {
      setContet(share);
    }
  }, [session, s_share_code, u_user, t_type_file]);

  const HandleRenderContente = () => {
    if (content) {
      switch (t_type_file) {
        case TypeContentEnum.videos:
          return <VideosPlayer params={{ id: content.id }} session={session} />;
        case TypeContentEnum.audios:
          return (
            <ClietAudiosPage params={{ id: content.id }} session={session} />
          );
        case TypeContentEnum.images:
          return (
            <PictureClietPage params={{ id: content.id }} session={session} />
          );
        case TypeContentEnum.livres:
          return (
            <ClientBookPage
              initData={content}
              params={{ id: content.id }}
              session={session}
            />
          );
        default:
          return <Notfound />;
      }
    } else {
      <Notfound />;
    }
  };

  useEffect(() => {
    getShareView();
  }, [getShareView]);

  return <div>{HandleRenderContente()}</div>;
};
