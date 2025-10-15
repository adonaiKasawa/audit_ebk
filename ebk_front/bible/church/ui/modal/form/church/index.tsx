import React from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { CiEdit } from "react-icons/ci";
import { Session } from "next-auth";

import Alert from "../../alert";

import { PrivilegesEnum } from "@/app/lib/config/enum";
import { updateChurcheApi } from "@/app/lib/actions/church/church";
import { Eglise } from "@/app/lib/config/interface";

export function UpdateChurchFormModal({
  church,
  session,
}: {
  church: Eglise;
  session: Session;
}) {
  const [nom_eglise, setNomEglise] = useState<string>(church.nom_eglise);
  const [sigle, setSigle] = useState<string>(church.sigle_eglise);
  const [adresse, setAdresse] = useState<string>(church.adresse_eglise);
  const [ville, setVille] = useState<string>(church.ville_eglise);
  const [pays, setPays] = useState<string>(church.pays_eglise);

  const [mot, setMot] = useState<string>(church.word_of_day_eglise);
  const [lat, setLat] = useState<number>(
    church?.localisation_eglise
      ? parseFloat(church?.localisation_eglise[0])
      : 0,
  );
  const [long, setLong] = useState<number>(
    church?.localisation_eglise
      ? parseFloat(church?.localisation_eglise[1])
      : 0,
  );
  const [about, setAbout] = useState<string>(church.about_eglise);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleSubmit = async () => {
    if (
      session &&
      session.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE &&
      session.user.eglise.id_eglise === church.id_eglise
    ) {
      setLoading(true);
      const update = await updateChurcheApi(
        {
          nom_eglise,
          sigle_eglise: sigle,
          adresse_eglise: adresse,
          ville_eglise: ville,
          pays_eglise: pays,

          localisation_eglise: [`${lat}`, `${long}`],
          about_eglise: about,
          word_of_day_eglise: mot,
        },
        church.id_eglise,
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
        document.location = "/church";
        setOpenModal(false);
        setOpenAlert(true);
        setAlertTitle("Modification réussi");
        setAlertMsg(
          "Les coordonnées de l'église ont été mises à jour avec succès.",
        );
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Erreur dans la modification!");
      setAlertMsg("Vous n'avez pas la permission d'effectuer cette action.");
    }
  };

  return (
    <>
      <CiEdit
        className="cursor-pointer"
        size={24}
        onClick={() => {
          setOpenModal(true);
        }}
      />
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier le Coordonnées de l&apos;église.
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Input
                    label="Nom"
                    type="text"
                    value={nom_eglise}
                    onChange={(e) => {
                      setNomEglise(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Sigle"
                    type="text"
                    value={sigle}
                    onChange={(e) => {
                      setSigle(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Adresse"
                    type="text"
                    value={adresse}
                    onChange={(e) => {
                      setAdresse(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Ville"
                    type="text"
                    value={ville}
                    onChange={(e) => {
                      setVille(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Pays"
                    type="text"
                    value={pays}
                    onChange={(e) => {
                      setPays(e.target.value);
                    }}
                  />
                  <br />

                  <h3>Information sur le site</h3>

                  <div className="flex flex-col gap-4">
                    <Input
                      className="mt-4"
                      label="Mot du jour"
                      type="text"
                      value={mot}
                      onChange={(e) => {
                        setMot(e.target.value);
                      }}
                    />

                    <Input
                      label="Lattitude"
                      type="number"
                      value={lat.toString()}
                      onChange={(e) => {
                        setLat(parseInt(e.target.value));
                      }}
                    />
                    <Input
                      label="Longitide"
                      type="number"
                      value={long.toString()}
                      onChange={(e) => {
                        setLong(parseInt(e.target.value));
                      }}
                    />

                    <Textarea
                      disableAnimation
                      disableAutosize
                      fullWidth
                      classNames={{
                        input: "resize-y min-h-[300px]",
                      }}
                      label="A propos de l'eglise"
                      placeholder="A propos de l'eglise"
                      style={{ minHeight: 160, width: "100%" }}
                      value={about}
                      variant="bordered"
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-primary text-white mt-4"
                    isLoading={loading}
                    type="submit"
                  >
                    Modifier
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
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
      </Modal>
    </>
  );
}
