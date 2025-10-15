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
  likes: Likes[];
  fileType: TypeContentEnum;
  session: Session | null;
}) => {
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [thisLikes, setThisLikes] = useState<Likes[]>(likes);

  const checkIfUserLikedFile = () => {
    const like = likes?.find((item) => item?.users?.id === session?.user.sub);

    if (like) {
      setUserLiked(true);
    }
  };

  const handleToggleLike = async () => {
    if (session) {
      setPending(true);
      const findLike = thisLikes.find(
        (item) => item.users?.id === session?.user.sub,
      );
      const req = userLiked
        ? await deleteLikeFileApi(findLike ? findLike?.id : 0)
        : await createLikeFileApi(idFile, fileType);

      setPending(false);
      if (!req.hasOwnProperty("statusCode") && !req.hasOwnProperty("message")) {
        if (userLiked) {
          setThisLikes(
            thisLikes.filter((item) => item.users?.id !== session?.user.sub),
          );
        } else {
          setThisLikes([...thisLikes, req]);
        }
        setUserLiked(!userLiked);
      } else {
        setOpenAlert(true);
        setAlertMsg(req.message);
      }
    } else {
      setOpenAlert(true);
      setAlertMsg(
        "Votre interaction est précieuse.\n Connectez-vous pour aimer le contenu.",
      );
    }
  };

  useEffect(() => {
    checkIfUserLikedFile();
  }, []);

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
            title={thisLikes?.length + ""}
            onClick={() => {
              handleToggleLike();
            }}
          />
          <p className="text-xs">{thisLikes?.length}</p>
        </div>
      )}
      <Alert
        alertBody={alertMsg}
        alertTitle={"Attention"}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </>
  );
};
