"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { AccountSettingComponents } from "./client.page";

import { authSigninUser, authenticate } from "@/app/lib/actions/auth";
import { updateMembreApi } from "@/app/lib/actions/membre/memb.req";
import Alert from "@/ui/modal/alert";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/ui/icons";

function PasswordPage({ initSession }: AccountSettingComponents) {
  const { user } = initSession;
  const route = useRouter();

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfrimPassword] = useState<string>("");
  const [isVisible, setIsVisible] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleRevalidatedUser = async () => {
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        const formData = new FormData();

        formData.append("telephone", user.telephone);
        formData.append("password", newPassword);
        authenticate(undefined, formData);
        route.refresh();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const update = await updateMembreApi({ password: newPassword }, user.sub);

    setLoading(false);
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
      handleRevalidatedUser();
      setOpenAlert(true);
      setAlertTitle("Modification réussi");
      setAlertMsg("La mofidication de compte a réussi.");
    }
  };

  const handleSubmitUpdatePassword = async () => {
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        const auth = await authSigninUser({
          telephone: user.telephone,
          password: currentPassword,
        });

        if (!auth.hasOwnProperty("statusCode")) {
          handleSubmit();
        }
      } else {
        setOpenAlert(true);
        setAlertTitle("Erreur");
        setAlertMsg(
          "Le nouveau mot de passe doit être identique avec la confirmation de mot de passe.",
        );
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      setAlertMsg("Veuillez remplir tous les champs.");
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitUpdatePassword();
        }}
      >
        <Input
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          label="Mot de passe actuele"
          type={isVisible ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
          }}
        />
        <Input
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          label="Nouveau mot de passe"
          type={isVisible ? "text" : "password"}
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
        <Input
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          label="Confirmer le nouveau mot de passe"
          type={isVisible ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfrimPassword(e.target.value);
          }}
        />
        <div>
          <Button
            className="bg-primary text-white mt-4"
            isLoading={loading}
            type="submit"
          >
            Modifier
          </Button>
        </div>
      </form>
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
    </div>
  );
}

export default PasswordPage;
