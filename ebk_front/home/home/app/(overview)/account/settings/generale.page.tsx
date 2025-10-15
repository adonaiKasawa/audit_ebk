"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { AccountSettingComponents } from "./client.page";

import { updateMembreApi } from "@/app/lib/actions/membre/memb.req";
import Alert from "@/ui/modal/alert";
import { Token } from "@/app/lib/config/interface";

function GeneralePage({ initSession }: AccountSettingComponents) {
  const { update } = useSession();
  const { user } = initSession;

  const [nom, setNom] = useState<string>(user.nom);
  const [prenom, setPrenom] = useState<string>(user.prenom);
  const [telephone, setTelephone] = useState<string>(
    user.telephone ? user.telephone : "",
  );
  const [email, setEmail] = useState<string>(user.email ? user.email : "");
  const [adresse, setAdresse] = useState<string>(
    user.adresse ? user.adresse : "",
  );
  const [ville, setVille] = useState<string>(user.ville ? user.ville : "");
  const [pays, setPays] = useState<string>(user.pays ? user.pays : "");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleRevalidatedUser = async (token: Token) => {
    await update({
      token,
      user: {
        nom,
        prenom,
        telephone,
        email,
        adresse,
        ville,
        pays,
      },
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    const update = await updateMembreApi(
      {
        nom,
        prenom,
        telephone,
        email,
        adresse,
        ville,
        pays,
      },
      user.sub,
    );

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
      handleRevalidatedUser(update);
      setOpenAlert(true);
      setAlertTitle("Modification réussi");
      setAlertMsg("La mofidication de compte a réussi.");
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="Nom"
              type="text"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              label="Prenom"
              type="text"
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              label="Téléphone"
              type="text"
              value={telephone}
              onChange={(e) => {
                setTelephone(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              label="Email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              label="Adresse"
              type="text"
              value={adresse}
              onChange={(e) => {
                setAdresse(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              label="Ville"
              type="text"
              value={ville}
              onChange={(e) => {
                setVille(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              label="Pays"
              type="text"
              value={pays}
              onChange={(e) => {
                setPays(e.target.value);
              }}
            />
          </div>

          <div className="col-span-2">
            <Button
              className="bg-primary text-white mt-4"
              isLoading={loading}
              type="submit"
            >
              Modifier
            </Button>
          </div>
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

export default GeneralePage;
