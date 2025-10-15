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
import { blockContentApi } from "@/app/lib/actions/content/content.req";
import { ImBlocked } from "react-icons/im";
import { FaHistory } from "react-icons/fa";
import Link from "next/link";

export function FavoriSignaleUI({
  contentId,
  typeContent,
  initFavoris,
  session,
  onBlocked
  
}: {
  contentId: number;
  typeContent: TypeContentEnum;
  initFavoris: Favoris[];
  session: Session | null;
    onBlocked?: (blockedId: number) => void; 
}) {
  const [userFavorised, setUserFavorised] = useState<boolean>(false);
  const [favoris, setFavoris] = useState<Favoris[]>(initFavoris);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

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

  const handelSignaleConte = async () => {
  setPending(true);

  const res = await createSignaleApi(
    typeContent,
    contentId,
    "Ce contenu est inapproprié"
  );

  setPending(false);

  if (!res?.statusCode && !res?.message) {
    setOpenAlert(true);
    console.log(res)
    setAlertMsg("Merci de nous avoir signalé ce contenu");
    setAlertTitle("Signaler");
    ;
    
  } else {
    setOpenAlert(true);
    setAlertMsg(res?.message || "Une erreur est survenue");
    setAlertTitle("Erreur");
  }
};

  const handelBlockContent = async () => {
  setPending(true);
  try {
    const res = await blockContentApi(contentId, typeContent);
    if (!res?.statusCode && !res?.message) {
      setAlertTitle("Bloqué");
      setAlertMsg("Ce contenu a été bloqué pour vous.");
      console.log(res);
      
    } else {
      setAlertTitle("Erreur");
      setAlertMsg(res?.message || "Impossible de bloquer le contenu.");
    }
  } catch (e) {
    setAlertTitle("Erreur");
    setAlertMsg("Une erreur est survenue lors du blocage.");
  } finally {
    setPending(false);
    setOpenAlert(true);
  }
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
            key="historique"
            startContent={
              <FaHistory size={25} />
            }
            
          >
            <Link href="/audios/historique">Historique</Link>
          </DropdownItem>
          <DropdownItem
            key="favoris"
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
            Signaler
          </DropdownItem>
          <DropdownItem
            key="bloquer"
            className="flex"
            startContent={
              pending ? (
                <Spinner color="danger" size="sm" />
              ) : (
                <ImBlocked size={25}/>
              )
            }
            onClick={handelBlockContent}
          >
            Bloquer
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
