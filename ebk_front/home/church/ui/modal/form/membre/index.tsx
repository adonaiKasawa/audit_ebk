import React from "react";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import Alert from "../../alert";

import {
  createMembresApi,
  updateMembreApi,
} from "@/app/lib/actions/membre/memb.req";

export function AddMembreFormModal({
  handleFindMemebres,
  id_eglise,
}: {
  handleFindMemebres: () => void;
  id_eglise: number;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [adresse, setAdresse] = useState<string>("");
  const [ville, setVille] = useState<string>("");
  const [pays, setPays] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleSubmit = async () => {
    if (nom && prenom && telephone) {
      setLoading(true);
      const create = await createMembresApi({
        nom,
        prenom,
        telephone,
        email,
        adresse,
        ville,
        pays,
        fk_eglise: id_eglise,
        password: telephone,
      });

      setLoading(false);
      if (
        create.hasOwnProperty("statusCode") &&
        create.hasOwnProperty("error")
      ) {
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
        handleFindMemebres();
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Champs obligatoires");
      setAlertMsg("Le nom, prenom et le numéro de télephone sont obligatoires");
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Ajouter un membre
      </Button>
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
                Ajouter un membre
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
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Prenom"
                    type="text"
                    value={prenom}
                    onChange={(e) => {
                      setPrenom(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Téléphone"
                    type="text"
                    value={telephone}
                    onChange={(e) => {
                      setTelephone(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
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
                  <Button
                    className="bg-primary text-white mt-4"
                    isLoading={loading}
                    type="submit"
                  >
                    Créer
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

export function UpdateMembreFormModal({
  handleFindMemebres,
  membre,
  openModal,
  setOpenModal,
}: {
  handleFindMemebres: () => void;
  membre: any;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [nom, setNom] = useState<string>(membre.nom);
  const [prenom, setPrenom] = useState<string>(membre.prenom);
  const [telephone, setTelephone] = useState<string>(membre.telephone);
  const [email, setEmail] = useState<string>(membre.email);
  const [adresse, setAdresse] = useState<string>(membre.adresse);
  const [ville, setVille] = useState<string>(membre.ville);
  const [pays, setPays] = useState<string>(membre.pays);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

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
      membre.id,
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
      handleFindMemebres();
      setOpenModal(false);
      setOpenAlert(true);
      setAlertTitle("Modification réussi");
      setAlertMsg("La mofidication de compte du membre a réussi.");
    }
  };

  return (
    <>
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
                Modifier le membre
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
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Prenom"
                    type="text"
                    value={prenom}
                    onChange={(e) => {
                      setPrenom(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Téléphone"
                    type="text"
                    value={telephone}
                    onChange={(e) => {
                      setTelephone(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
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
