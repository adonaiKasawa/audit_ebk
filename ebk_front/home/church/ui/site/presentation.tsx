import React, { useState } from "react";
import NextImage from "next/image";
import { Session } from "next-auth";
import { MdCameraswitch } from "react-icons/md";
import { Button } from "@heroui/button";

import DialogAction from "@/ui/modal/dialog";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { file_url } from "@/app/lib/request/request";
import { Eglise } from "@/app/lib/config/interface";

export default function PresentationSite({
  eglise,
  session,
}: {
  eglise: Eglise;
  session: Session | null;
}) {
  const [openDialogAction, setOpenDialogoAction] = useState<boolean>(false);

  const handleUpatePhotoProfil = async () => {
    if (
      session &&
      session.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE
    ) {
    } else {
    }
  };

  return (
    <>
      <div className="flex" style={{ position: "relative" }}>
        <NextImage
          alt={`Photo de l'eglise ${eglise?.nom_eglise}`}
          className="object-cover w-full"
          height={550}
          src={`${file_url + eglise.couverture_eglise}`}
          style={{
            height: 550,
            width: "100%",
          }}
          width={1000}
        />
        {session &&
          session.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE &&
          eglise.id_eglise === session.user.eglise.id_eglise && (
            <label
              className="absolute right-3 top-4 cursor-pointer "
              htmlFor="couvertureFile"
            >
              <MdCameraswitch className="text-white" size={30} />
              <input
                hidden
                id="couvertureFile"
                name="couvertureFile"
                type="file"
              />
            </label>
          )}

        <div
          className="flex"
          style={{
            width: "50%",
            backgroundColor: "#0000008e",
            height: "100%",
            position: "absolute",
            left: "50%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              justifySelf: "center",
              alignSelf: "center",
              width: "80%",
              textAlign: "center",
              color: "white",
            }}
          >
            <h1 style={{ fontSize: 35, marginBottom: 10 }}>
              Le phrase du jour
            </h1>
            <h3 style={{ fontSize: 20, marginBottom: 10 }}>
              {eglise.word_of_day_eglise}
            </h3>

            <Button className="don-button" size="lg" variant="solid">
              Faire un don
            </Button>
          </div>
        </div>
      </div>
      <DialogAction
        action={async () => {
          handleUpatePhotoProfil();
        }}
        dialogBody={
          <p>
            Etes-vous sure vouloir modifier la photo de profile de
            l&apos;église?
          </p>
        }
        dialogTitle={"Suppresion du sujet"}
        isOpen={openDialogAction}
        onClose={() => {
          setOpenDialogoAction(false);
        }}
        onOpen={() => setOpenDialogoAction(true)}
      />
    </>
  );
}
