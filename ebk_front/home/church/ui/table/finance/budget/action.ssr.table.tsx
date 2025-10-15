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
import { ManagementBudget } from "@/app/lib/config/interface";
import {
  SubPrevisionFormModal,
  UpdateBudgetFormModal,
} from "@/ui/modal/form/finance/budget";
import { deleteManagementBudgetApi } from "@/app/lib/actions/management/finance/finance.req";

export const ActionBudget = ({
  budget,
  handleFindBudget,
}: {
  budget: ManagementBudget;
  handleFindBudget: () => Promise<void>;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleDeleteManagementBudget = async () => {
    const update = await deleteManagementBudgetApi(budget.id);

    if (
      update.hasOwnProperty("statusCode") &&
      update.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof update.message === "object") {
        let message = "";

        update.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    } else {
      handleFindBudget();
      setOpenModal(false);
      setOpenAlert(true);
      setAlertTitle("Suppresion réussi");
      setAlertMsg(
        "La suppresion de cette ligne budgetaire se effectuer avec succés.",
      );
    }
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
            key={"detail"}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Détail
          </DropdownItem>
          <DropdownItem key={"update"} onClick={onOpen}>
            Modifier
          </DropdownItem>
          <DropdownItem
            key={"delete"}
            onClick={() => {
              setOnBloqued(true);
            }}
          >
            Supprimer
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
        action={handleDeleteManagementBudget}
        dialogBody={
          <p>Étes-vous sure de vouloir supprimer cette ligne budgetaire?</p>
        }
        dialogTitle={"supprimer la ligne budgetaire"}
        isOpen={onBloqued}
        onClose={() => {
          setOnBloqued(false);
        }}
        onOpen={() => {
          setOnBloqued(true);
        }}
      />
      <UpdateBudgetFormModal
        budget={budget}
        handleFindEvent={handleFindBudget}
        isOpen={isOpen}
        onClose={onClose}
      />
      <SubPrevisionFormModal
        budget={budget}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
};
