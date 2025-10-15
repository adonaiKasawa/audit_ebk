"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { AccountSettingComponents } from "./client.page";

import { AuthDeleteApi, authSigninUser } from "@/app/lib/actions/auth";
import Alert from "@/ui/modal/alert";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/ui/icons";

function DeleteAccountPage({ initSession }: AccountSettingComponents) {
  const { user } = initSession;
  const route = useRouter();

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [isVisible, setIsVisible] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async () => {
    setLoading(true);
    const update = await AuthDeleteApi();

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
      setOpenAlert(true);
      setAlertTitle("Suppression réussi");
      setAlertMsg(
        "La suppression de votre compte a réussi ; vos données seront supprimées définitivement dans 30 jours.",
      );
      route.push("/api/auth/signout/auto");
    }
  };

  const handleSubmitUpdatePassword = async () => {
    if (currentPassword) {
      setLoading(true);
      const auth = await authSigninUser({
        telephone: user.telephone,
        password: currentPassword,
      });

      setLoading(false);
      if (!auth.hasOwnProperty("statusCode")) {
        handleSubmit();
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
        <div>
          <Button
            className="bg-primary text-white mt-4 p-4 font-bold"
            isLoading={loading}
            type="submit"
          >
            Supprimer
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

export default DeleteAccountPage;
