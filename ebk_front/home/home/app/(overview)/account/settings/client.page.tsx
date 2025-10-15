"use client";

import React, { useState } from "react";
import { Session } from "next-auth";
import { LuLock, LuSettings, LuUserMinus } from "react-icons/lu";
import { BsShieldLock } from "react-icons/bs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Listbox, ListboxItem } from "@heroui/listbox";

import PasswordPage from "./password.page";
import GeneralePage from "./generale.page";
import DeleteAccountPage from "./delete.account.page";
import { IdentificationAccount } from "./identification.account.page";
export interface IAlertSetting {
  openAlert: boolean;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  alertMsg: string;
  setAlertMsg: React.Dispatch<React.SetStateAction<string>>;
  alertTitle: string;
  setAlertTitle: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AccountSettingComponents {
  initSession: Session;
}

export function ClientPage({ initSession }: { initSession: Session }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["generale"]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys],
  );

  // const [currentPassword, setCurrentPassword] = useState<string>("");
  // const [newPassword, setNewPassword] = useState<string>("");
  // const [confirmPassword, setConfrimPassword] = useState<string>("");
  // const [isVisible, setIsVisible] = React.useState(false);

  // const toggleVisibility = () => setIsVisible(!isVisible);

  const GetFormForStep = () => {
    switch (selectedValue) {
      case "generale":
        return <GeneralePage initSession={initSession} />;
      case "password":
        return <PasswordPage initSession={initSession} />;
      case "deleteAccount":
        return <DeleteAccountPage initSession={initSession} />;
      case "identificationAccount":
        return <IdentificationAccount />;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-4">
        <Card shadow="sm">
          <CardHeader>
            <p className="text-3xl font-bold">Paramètres</p>
          </CardHeader>
          <CardBody>
            <Listbox
              disallowEmptySelection
              aria-label="Multiple selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={(e: any) => {
                setSelectedKeys(e);
              }}
            >
              <ListboxItem
                key="generale"
                startContent={<LuSettings size={24} />}
              >
                Général
              </ListboxItem>
              <ListboxItem key="password" startContent={<LuLock size={24} />}>
                Mot de passe
              </ListboxItem>
              <ListboxItem
                key="identificationAccount"
                startContent={<BsShieldLock size={24} />}
              >
                Identification du compte
              </ListboxItem>
              <ListboxItem
                key="deleteAccount"
                startContent={<LuUserMinus size={24} />}
              >
                Supprimer le compte
              </ListboxItem>
            </Listbox>
          </CardBody>
        </Card>
      </div>
      <div className="col-span-12 md:col-span-8">
        <Card shadow="sm">
          <CardHeader>
            <p className="text-3xl font-bold">
              {selectedValue == "generale" && "Génerale"}
              {selectedValue == "password" && "Mot de passe"}
              {selectedValue == "deleteAccount" && "Supprimer le compte"}
              {selectedValue == "identificationAccount" &&
                "Identification du compte"}
            </p>
          </CardHeader>
          <CardBody>{GetFormForStep()}</CardBody>
        </Card>
      </div>
    </div>
  );
}
