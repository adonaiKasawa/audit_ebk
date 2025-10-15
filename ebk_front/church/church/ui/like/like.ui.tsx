import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import { CiHeart } from "react-icons/ci";
import { Spinner } from "@heroui/spinner";

import Alert from "../modal/alert";

import { TypeContentEnum } from "@/app/lib/config/enum";
import { Likes } from "@/app/lib/config/interface";
import {
  createLikeFileApi,
  deleteLikeFileApi,
} from "@/app/lib/actions/like/like.req";

export const LikeFileUI = ({
  idFile,
  likes,
  fileType,
  session,
}: {
  idFile: number;
  likes?: Likes[]; // peut être undefined
  fileType: TypeContentEnum;
  session: Session | null;
}) => {
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [thisLikes, setThisLikes] = useState<Likes[]>(likes || []);

  const checkIfUserLikedFile = () => {
  if (!session) return;

  const userId = Number(session.user.sub); // toujours caster au cas où

  const like = thisLikes.find((item) => item?.users?.id === userId);

  setUserLiked(!!like);
};

console.log(idFile, fileType,);


const handleToggleLike = async () => {
  if (!session) {
    setOpenAlert(true);
    setAlertMsg(
      "Votre interaction est précieuse.\n Connectez-vous pour aimer le contenu.",
    );
    return;
  }

  setPending(true);

  try {
    const userId = Number(session.user.sub);

    const findLike = thisLikes.find((item) => item.users?.id === userId);

    const req = userLiked
      ? await deleteLikeFileApi(findLike ? findLike.id : 0, fileType)
      : await createLikeFileApi(idFile, fileType);

    if (!("statusCode" in req) && !("message" in req)) {
      setThisLikes((prev) =>
        userLiked
          ? prev.filter((item) => item.users?.id !== userId)
          : [...prev, req],
      );
      setUserLiked(!userLiked);
    } else {
      setOpenAlert(true);
      setAlertMsg(req.message);
    }
  } catch (err: any) {
    setOpenAlert(true);
    setAlertMsg(err.message || "Une erreur est survenue.");
  } finally {
    setPending(false);
  }
};


  useEffect(() => {
    checkIfUserLikedFile();
  }, [thisLikes, session]);

  return (
    <>
      {pending ? (
        <Spinner color="danger" />
      ) : (
        <div className="flex items-center justify-center">
          <CiHeart
            className="cursor-pointer"
            color={userLiked ? "red" : "primary"}
            size={30}
            title={thisLikes.length + ""}
            onClick={handleToggleLike}
          />
          <p className="text-xs">{thisLikes.length}</p>
        </div>
      )}
      <Alert
        alertBody={alertMsg}
        alertTitle="Attention"
        isOpen={openAlert}
        onClose={() => setOpenAlert(false)}
        onOpen={() => setOpenAlert(true)}
      />
    </>
  );
};
