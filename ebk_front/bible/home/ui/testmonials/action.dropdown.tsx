import { CiStar, CiWarning } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

import Alert from "../modal/alert";

import { updateStatusTestmonial } from "@/app/lib/actions/testmonial/testmonial.req";
import { createSignaleApi } from "@/app/lib/actions/signale/signale.req";
import {
  createFavorisApi,
  deleteFavorisApi,
} from "@/app/lib/actions/favoris/favoris.req";
import {
  PrivilegesEnum,
  TestimonialStatusEnum,
  TypeContentEnum,
} from "@/app/lib/config/enum";
import { Favoris, ItemTesmonial } from "@/app/lib/config/interface";

export function ActionDropDownTestMonialUI({
  contentId,
  typeContent,
  initFavoris,
  session,
  testmonial,
  handleFindTestmonials,
}: {
  contentId: number;
  typeContent: TypeContentEnum;
  initFavoris: Favoris[];
  session: Session | null;
  testmonial: ItemTesmonial;
  handleFindTestmonials: () => Promise<void>;
}) {
  const [userFavorised, setUserFavorised] = useState<boolean>(false);
  const [favoris, setFavoris] = useState<Favoris[]>(initFavoris);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [statusPending, setStatusPending] = useState<boolean>(false);
  const [statusAction, setStatusAction] = useState<TestimonialStatusEnum | "">(
    "",
  );

  const handelCheckIfUserFavoris = () => {
    if (favoris.find((item) => item?.users?.id === session?.user.sub)) {
      setUserFavorised(true);
    }
  };

  const handelFavorisContent = async () => {
    setPending(true);
    const findFavoris = favoris.find(
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
        if (favoris.length > 0) {
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
  };

  const handelControlleTestMonial = async (status: TestimonialStatusEnum) => {
    setStatusPending(true);
    setStatusAction(status);
    const req = await updateStatusTestmonial({ status }, testmonial.id);

    setStatusPending(false);
    setStatusAction("");
    if (!req.hasOwnProperty("statusCode") && !req.hasOwnProperty("message")) {
      setOpenAlert(true);
      setAlertMsg("Le statut du témoignage a été mis à jour avec succès.");
      setAlertTitle("Réussi!");
      await handleFindTestmonials();
    } else {
      setOpenAlert(true);
      setAlertMsg(
        "La modification du statut du témoignage a échoué. Veuillez réessayer.",
      );
      setAlertTitle("Erreur");
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
            <HiDotsHorizontal className="cursor-pointer" size={30} />
          </Button>
        </DropdownTrigger>
        {session && session.user.privilege_user === PrivilegesEnum.FIDELE ? (
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
              {favoris.length} Favoris
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
        ) : session?.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE &&
          session.user.eglise.id_eglise === testmonial.eglise.id_eglise &&
          testmonial.status === TestimonialStatusEnum.PENDING ? (
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="response"
              startContent={
                statusPending &&
                statusAction === TestimonialStatusEnum.ACTIVE ? (
                  <Spinner color="danger" />
                ) : (
                  <IoCheckmarkDone className="cursor-pointer" size={30} />
                )
              }
              onClick={() => {
                handelControlleTestMonial(TestimonialStatusEnum.ACTIVE);
              }}
            >
              Approuver
            </DropdownItem>
            <DropdownItem
              key="liked"
              className="flex"
              startContent={
                statusPending &&
                statusAction === TestimonialStatusEnum.INACTIVE ? (
                  <Spinner color="danger" />
                ) : (
                  <GiCancel className="cursor-pointer" size={30} />
                )
              }
              onClick={() => {
                handelControlleTestMonial(TestimonialStatusEnum.INACTIVE);
              }}
            >
              Rejeter
            </DropdownItem>
          </DropdownMenu>
        ) : testmonial.status === TestimonialStatusEnum.ACTIVE ? (
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="liked"
              className="flex"
              startContent={
                statusPending &&
                statusAction === TestimonialStatusEnum.INACTIVE ? (
                  <Spinner color="danger" />
                ) : (
                  <GiCancel className="cursor-pointer" size={30} />
                )
              }
              onClick={() => {
                handelControlleTestMonial(TestimonialStatusEnum.INACTIVE);
              }}
            >
              Rejeter
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="response"
              startContent={
                statusPending &&
                statusAction === TestimonialStatusEnum.ACTIVE ? (
                  <Spinner color="danger" />
                ) : (
                  <IoCheckmarkDone className="cursor-pointer" size={30} />
                )
              }
              onClick={() => {
                handelControlleTestMonial(TestimonialStatusEnum.ACTIVE);
              }}
            >
              Approuver
            </DropdownItem>
          </DropdownMenu>
        )}
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
