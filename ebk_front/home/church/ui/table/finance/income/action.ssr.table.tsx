"use client";

import React, { useState } from "react";
import { Session } from "next-auth";
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
import { ManagementIncome } from "@/app/lib/config/interface";
import {
  deleteManagementIncomeApi,
  updateIncomeUnLinkBudgetApi,
} from "@/app/lib/actions/management/finance/finance.req";
import { UpdateIncomeFormModal } from "@/ui/modal/form/finance/income";

export const ActionIncome = ({
  session,
  income,
  handleFindIncome,
}: {
  income: ManagementIncome;
  handleFindIncome: () => Promise<void>;
  session: Session;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleDeleteManagementIncome = async () => {
    const update = await deleteManagementIncomeApi(income.id);

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
      handleFindIncome();
      setOpenAlert(true);
      setAlertTitle("Suppresion réussi");
      setAlertMsg(
        "La suppresion de cette récette s'est effectuer avec succés.",
      );
    }
  };

  const handleIncomeUnLinkBudget = async () => {
    const unlink = await updateIncomeUnLinkBudgetApi(income.id);

    if (
      !unlink.hasOwnProperty("statusCode") &&
      (!unlink.hasOwnProperty("error") || !unlink.hasOwnProperty("error"))
    ) {
      handleFindIncome();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof unlink.message === "object") {
        let message = "";

        unlink.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(unlink.message);
      }
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
        {income.budget !== null ? (
          <DropdownMenu>
            <DropdownItem key={"update"} onClick={onOpen}>
              Modifier
            </DropdownItem>
            <DropdownItem
              key={"reccette"}
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Dissocier la recette
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
        ) : (
          <DropdownMenu>
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
        )}
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
        action={handleDeleteManagementIncome}
        dialogBody={<p>Étes-vous sure de vouloir supprimer cette recette?</p>}
        dialogTitle={"Supprimer la recette"}
        isOpen={onBloqued}
        onClose={() => {
          setOnBloqued(false);
        }}
        onOpen={() => {
          setOnBloqued(true);
        }}
      />
      <DialogAction
        action={handleIncomeUnLinkBudget}
        dialogBody={
          <p>Étes-vous sure delier cette recette au budget affecter?</p>
        }
        dialogTitle={"Delier la recette"}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        onOpen={() => {
          setOpenModal(true);
        }}
      />
      <UpdateIncomeFormModal
        handleFindIncome={handleFindIncome}
        income={income}
        isOpen={isOpen}
        session={session}
        onClose={onClose}
      />
    </div>
  );
};
