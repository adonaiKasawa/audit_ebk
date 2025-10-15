"use client";
import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { Likes, Favoris, Commentaires } from "@/app/lib/config/interface";
import { LikeFileUI } from "@/ui/like/like.ui";
import { FavoriSignaleUI } from "@/ui/favoriSignale/favoris.signale";
import { CommentModalUI } from "@/ui/modal/form/comment";
 // <-- API qui retourne le testimonial complet
import { getFileById } from "@/app/lib/actions/library/library";

interface TestimonialActionsProps {
  testimonialId: number;
  initialLikes: Likes[];
  initialFavorites: Favoris[];
  comments?: Commentaires[];
  session: Session | null;
}

export default function TestimonialActions({
  testimonialId,
  initialLikes,
  initialFavorites,
  comments = [],
  session,
}: TestimonialActionsProps) {
  const [likes, setLikes] = useState<Likes[]>(initialLikes);

  useEffect(() => {
    const fetchLikes = async () => {
      const testimonial = await getFileById(String(testimonialId), TypeContentEnum.testimonials);
      console.log("likes dans testi",testimonial);
      
      setLikes(testimonial.likes || []);
    };
    fetchLikes();
  }, [testimonialId]);

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex gap-4">
        <LikeFileUI
          idFile={testimonialId}
          likes={likes}
          fileType={TypeContentEnum.testimonials}
          session={session}
        />

        {session && (
          <CommentModalUI
            idEglise={0}
            idFile={testimonialId}
            typeFile={TypeContentEnum.testimonials}
            comments={comments}
            loadingComment={false}
            session={session}
          />
        )}

        <FavoriSignaleUI
          contentId={testimonialId}
          typeContent={TypeContentEnum.testimonials}
          initFavoris={initialFavorites}
          session={session}
        />
      </div>
    </div>
  );
}
