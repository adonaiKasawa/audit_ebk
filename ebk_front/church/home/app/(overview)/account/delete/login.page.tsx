"use client";

import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import Alert from "@/ui/modal/alert";
import { authenticate } from "@/app/lib/actions/auth";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/ui/icons";

export default function AccountLoginToDeleteAccount() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  // const [isOpenAlertTerms, setIsOpenAlertTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Connexion
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");

  const route = useRouter();

  const onOpenAlert = () => setIsOpenAlert(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmitLogin = async () => {
    if (telephone && telephone) {
      setLoading(true);
      const formData = new FormData();

      formData.append("telephone", telephone);
      formData.append("password", password);
      try {
        const response = await authenticate(undefined, formData);

        if (
          response === "Invalid credentials." ||
          response === "Something went wrong."
        ) {
          throw new Error(response);
        } else {
          route.refresh();
        }
      } catch {
        setErrorMessage("Identifiant incorrecte");
        onOpenAlert();
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs.");
      onOpenAlert();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitLogin();
      }}
    >
      <Input
        className="mt-4 mb-4"
        endContent={
          <FaPhoneAlt className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Numéro de téléphone"
        name="telephone"
        placeholder="Entrer votre numéro de téléphone"
        type="text"
        value={telephone}
        variant="bordered"
        onChange={(e) => setTelephone(e.target.value)}
      />
      <Input
        className="mt-4 mb-4"
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
        label="Mot de passe"
        name="password"
        placeholder="Entrer votre mot de passe"
        type={isVisible ? "text" : "password"}
        value={password}
        variant="bordered"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-col w-full gap-4">
        <Button
          aria-disabled={loading}
          className="mx-1 font-bold"
          color="primary"
          isLoading={loading}
          type="submit"
        >
          <p className="text-white">{loading ? "En cours..." : "Connexion"}</p>
        </Button>
      </div>
      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle={"Connexion"}
        isOpen={isOpenAlert}
        onClose={() => {
          setIsOpenAlert(false);
        }}
        onOpen={() => {
          setIsOpenAlert(true);
        }}
      />
    </form>
  );
}
