"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import {
  EventSubscribeFormModal,
  UpdateEventFormModal,
} from "@/ui/modal/form/event";
import { ManagementEvent } from "@/app/lib/config/interface";

export const ActionEvent = ({
  event,
  handleFindEvent,
}: {
  event: ManagementEvent;
  handleFindEvent: () => Promise<void>;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg] = useState<string>("");
  const [alertTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

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
            key={"reservation"}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Réservation
          </DropdownItem>
          <DropdownItem key={"update"} onClick={onOpen}>
            Modifier
          </DropdownItem>
          <DropdownItem
            key={"block_run"}
            onClick={() => {
              setOnBloqued(true);
            }}
          >
            {" "}
            {event.isBlocked ? "Lancer" : "Bloquer"}
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
            Étes-vous sure de vouloir {event.isBlocked ? "lancer" : "bloquer"}{" "}
            cette événement?
          </p>
        }
        dialogTitle={`${event.isBlocked ? "Lancer" : "Bloquer"} l'événement`}
        isOpen={onBloqued}
        onClose={() => {
          setOnBloqued(false);
        }}
        onOpen={() => {
          setOnBloqued(true);
        }}
      />
      <UpdateEventFormModal
        event={event}
        handleFindEvent={handleFindEvent}
        isOpen={isOpen}
        onClose={onClose}
      />
      <EventSubscribeFormModal
        event={event}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
};
