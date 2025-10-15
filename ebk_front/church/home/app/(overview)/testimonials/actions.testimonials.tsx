import React from "react";
import { Session } from "next-auth";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { Likes, Favoris, Commentaires } from "@/app/lib/config/interface";
import { LikeFileUI } from "@/ui/like/like.ui"; 
import { FavoriSignaleUI } from "@/ui/favoriSignale/favoris.signale"; 
import { CommentModalUI } from "@/ui/modal/form/comment"; // ton modal

interface TestimonialActionsProps {
  testimonialId: number;
  initialLiked: boolean;
  initialLikes: Likes[];
  initialFavorited: boolean;
  initialFavorites: Favoris[];
  comments?: Commentaires[];
  session: Session | null;
  onRefresh: () => void; // ✅ nouvelle prop
}

export default function TestimonialActions({
  testimonialId,
  initialLiked,
  initialLikes,
  initialFavorited,
  initialFavorites,
  comments = [],
  session,
  onRefresh,
}: TestimonialActionsProps) {
  console.log(testimonialId);
  
  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex gap-4">
        {/* Like */}
        <LikeFileUI
          idFile={testimonialId}
          likes={initialLikes}
          fileType={TypeContentEnum.testimonials}
          session={session}
          onRefresh={onRefresh}
        />

        {/* Commentaires via modal */}
        {session && (
          <CommentModalUI
          
            idEglise={0} // ou l'ID de l'église si nécessaire
            idFile={testimonialId}
            typeFile={TypeContentEnum.testimonials}
            comments={comments}
            loadingComment={false}
            session={session}
          />
        )}

        {/* Favoris / Signaler */}
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
