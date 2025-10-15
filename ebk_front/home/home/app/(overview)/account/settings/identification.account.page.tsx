"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@heroui/button";

import { UploadImagesUI } from "@/ui/cropperFile/image";
import Alert from "@/ui/modal/alert";
import { IdentificationSendFileApi } from "@/app/lib/actions/auth";

export function IdentificationAccount() {
  const [croppedImageUrl, setCroppedImageUrl] = useState<any[]>();

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    if (croppedImageUrl) {
      for (let i = 0; i < croppedImageUrl.length; i++) {
        const element = croppedImageUrl[i];

        formData.append("photos", element);
      }
    }
    const create = await IdentificationSendFileApi(formData);

    setLoading(false);

    if (create.hasOwnProperty("statusCode") && create.hasOwnProperty("error")) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof create.message === "object") {
        let message = "";

        create.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    } else {
      setCroppedImageUrl(undefined);
      setAlertMsg("Merci d'avoir envoyer vos pieces d'identité");
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-4 p-4">
          <p className="text-xl">
            Nous vous remercions d&lsquo;avoir bien voulu nous transmettre vos
            pi&apos;ces d&lsquo;identité
          </p>
          <div className="">
            <UploadImagesUI
              key={"1"}
              croppedImageUrl={croppedImageUrl}
              setCroppedImageUrl={setCroppedImageUrl}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-primary text-white mt-4"
            isLoading={loading}
            type="submit"
          >
            ENVOYER POUR VÉRIFICATION
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
    </>
  );
}
