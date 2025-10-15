import { CiStar, CiWarning } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Spinner } from "@heroui/spinner";

import Alert from "../modal/alert";

import { createSignaleApi } from "@/app/lib/actions/signale/signale.req";
import {
  createFavorisApi,
  deleteFavorisApi,
} from "@/app/lib/actions/favoris/favoris.req";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { Favoris } from "@/app/lib/config/interface";

export function FavoriSignaleUI({
  contentId,
  typeContent,
  initFavoris,
  session,
}: {
  contentId: number;
  typeContent: TypeContentEnum;
  initFavoris: Favoris[];
  session: Session | null;
}) {
  const [userFavorised, setUserFavorised] = useState<boolean>(false);
  const [favoris, setFavoris] = useState<Favoris[]>(initFavoris);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  console.log(typeContent);
  

  const handelCheckIfUserFavoris = () => {
    if (favoris?.find((item) => item?.users?.id === session?.user.sub)) {
      setUserFavorised(true);
    }
  };

  const handelFavorisContent = async () => {
    setPending(true);
    const findFavoris = favoris?.find(
      (item) => item.users?.id === session?.user.sub,
    );

    const req = userFavorised
      ? await deleteFavorisApi(findFavoris ? findFavoris.id : 0)
      : await createFavorisApi(typeContent, contentId);

    setPending(false);
    if (!req.hasOwnProperty("statusCode") && !req.hasOwnProperty("message")) {
      if (userFavorised) {
        setFavoris(
          favoris.filter((item) => item.users?.id !== session?.user.sub),
        );
      } else {
        if (favoris?.length > 0) {
          setFavoris([...favoris, req]);
        } else {
          setFavoris([req]);
        }
      }
      setUserFavorised(!userFavorised);
    } else {
      setOpenAlert(true);
      setAlertMsg(req.message);
      setAlertTitle("Erreur");
    }
  };

  const handelSignaleConte = () => {
    setOpenAlert(true);
    setAlertMsg("Merci de nous avoir signaler ce contenu");
    setAlertTitle("Signaler");
    createSignaleApi(typeContent, contentId);
    console.log("Signaler ce contenu",typeContent, contentId);
    
  };

  useEffect(() => {
    handelCheckIfUserFavoris();
  }, []);

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <HiDotsHorizontal className="cursor-pointer" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="response"
            startContent={
              pending ? (
                <Spinner color="danger" />
              ) : (
                <CiStar
                  className="cursor-pointer"
                  color={userFavorised ? "red" : "primary"}
                  size={30}
                />
              )
            }
            onClick={() => {
              handelFavorisContent();
            }}
          >
            {favoris?.length} Favoris
          </DropdownItem>
          <DropdownItem
            key="liked"
            className="flex"
            startContent={
              <CiWarning
                className="cursor-pointer"
                color={"primary"}
                size={30}
              />
            }
            onClick={() => {
              handelSignaleConte();
            }}
          >
            Singaler
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Alert
        alertBody={alertMsg}
        alertTitle={alertTitle}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </div>
  );
}
