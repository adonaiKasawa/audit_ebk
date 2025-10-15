import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { StatusAcounteEnum } from "@/app/lib/config/enum";
import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";

export const ActionMembre = ({
  membre,
}: {
  membre: any;
  setMembres: Dispatch<SetStateAction<any>>;
  membres: any[];
  handleFindPersonneMemebres: () => Promise<void>;
}) => {
  const [, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg] = useState<string>("");
  const [alertTitle] = useState<string>("");

  const handleBloqueMembres = async () => {
    // const update = await updateMembreApi({
    //   status: membre.status === StatusAcounteEnum.ACTIF ? StatusAcounteEnum.INACTIF : StatusAcounteEnum.ACTIF
    // }, membre.id);
    // if (update.hasOwnProperty("statusCode") && update.hasOwnProperty("message")) {
    //   setOpenAlert(true);
    //   setAlertTitle("Erreur");
    //   if (typeof update.message === "object") {
    //     let message = '';
    //     update.message.map((item: string) => message += `${item} \n`)
    //     setAlertMsg(message);
    //   } else {
    //     setAlertMsg(update.message);
    //   }
    // } else {
    //   handleFindMemebres();
    //   setOpenModal(false);
    //   setOpenAlert(true);
    //   setAlertTitle("Modification réussi");
    //   setAlertMsg("La mofidication de compte du membre a réussi.");
    // }
  };

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown className="bg-background border-1 border-default-200">
        <DropdownTrigger>
          <Button isIconOnly radius="full" size="sm" variant="light">
            <VerticalDotsIcon className="text-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key={"update"}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Modifier
          </DropdownItem>
          <DropdownItem
            key={"block"}
            onClick={() => {
              setOnBloqued(true);
            }}
          >
            {" "}
            {membre.status === StatusAcounteEnum.ACTIF
              ? "Bloquer"
              : "Débloquer"}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={alertTitle}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
      <DialogAction
        action={handleBloqueMembres}
        dialogBody={
          <p>
            Étes-vous sure de vouloir{" "}
            {membre.status === StatusAcounteEnum.ACTIF
              ? "bloquer"
              : "débloquer"}{" "}
            ce membre?
          </p>
        }
        dialogTitle={"Bloquer le membres"}
        isOpen={onBloqued}
        onClose={() => {
          setOnBloqued(false);
        }}
        onOpen={() => {
          setOnBloqued(true);
        }}
      />
      {/* <UpdateMembreFormModal
      openModal={openModal}
      setOpenModal={setOpenModal}
      membre={membre}
      handleFindMemebres={handleFindMemebres}
    /> */}
    </div>
  );
};
