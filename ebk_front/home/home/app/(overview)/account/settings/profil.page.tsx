"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { AccountSettingComponents } from "./client.page";

import { authSigninUser } from "@/app/lib/actions/auth";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";

function ProfilPage({ initSession }: AccountSettingComponents) {
  const { user } = initSession;
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfrimPassword] = useState<string>("");
  const [isVisible, setIsVisible] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmitUpdatePassword = async () => {
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        setLoading(true);
        const auth = await authSigninUser({
          telephone: user.telephone,
          password: currentPassword,
        });

        setLoading(false);
        if (!auth.hasOwnProperty("statusCode")) {
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

export default ProfilPage;
