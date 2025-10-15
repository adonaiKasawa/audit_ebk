"use client";

import React from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import Alert from "../../alert";

import { Programme } from "@/app/lib/config/interface";
import {
  addSousProgrammeApi,
  createProgrammeApi,
} from "@/app/lib/actions/programme/prog.res";

export function AddProgrammeFormModal({
  initProgramme,
  setInitPrograame,
  selected,
}: {
  initProgramme: Programme[] | undefined;
  setInitPrograame: Dispatch<SetStateAction<Programme[] | undefined>>;
  selected: string | number;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [libelle, setLibelle] = useState<string>("");
  const [debut, setDebut] = useState<string>("");
  const [fin, setFin] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleAddSousprogramme = async (id: number, programme?: Programme) => {
    if (libelle && debut && fin) {
      setLoading(true);
      const create = await addSousProgrammeApi(
        {
          libelle,
          debut: debut,
          fin: fin,
        },
        id,
      );

      setLoading(false);
      if (create.hasOwnProperty("id")) {
        if (programme) {
          programme.sousProgramme.push(create);
          if (initProgramme) {
            setInitPrograame([...initProgramme, programme]);
          }
        } else {
          if (initProgramme) {
            const findprogramme = initProgramme.find(
              (item) => item.titre.toLowerCase() === selected,
            );
            const newProgramme = initProgramme.filter(
              (item) => item.id !== findprogramme?.id,
            );

            if (newProgramme && findprogramme) {
              findprogramme.sousProgramme.push(create);
              setInitPrograame([...newProgramme, findprogramme]);
            }
          }
        }
        setAlertTitle("Reussie");
        setAlertMsg("Le programme est ajouter correctement.");
        setOpenAlert(true);
        setOpenModal(false);
      } else {
        setAlertTitle("Erreur");
        setAlertMsg("Une erreur se produite lors de l'ajout du programme.");
        setOpenAlert(true);
      }
    } else {
      setAlertTitle("Erreur");
      setAlertMsg("Vous dévez remplire correctement le formulaire.");
      setOpenAlert(true);
    }
  };

  const handleSubmit = async () => {
    const findprogramme = initProgramme?.find(
      (item) => item.titre.toLowerCase() === selected,
    );

    if (findprogramme) {
      handleAddSousprogramme(findprogramme.id);
    } else {
      setLoading(true);
      const create = await createProgrammeApi({ titre: selected.toString() });

      setLoading(false);
      if (create.hasOwnProperty("id")) {
        handleAddSousprogramme(create.id, { ...create, sousProgramme: [] });
      } else {
        setLoading(false);
        setAlertTitle("Erreur");
        setAlertMsg("Vous dévez remplire correctement le formulaire.");
        setOpenAlert(true);
      }
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
        Ajouter un programme
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
                Ajouter un programme
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Input
                    label="Évenement"
                    type="text"
                    value={libelle}
                    onChange={(e) => {
                      setLibelle(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Heure du début"
                    type="datetime-local"
                    value={debut}
                    onChange={(e) => {
                      setDebut(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Heure de la fin"
                    type="datetime-local"
                    value={fin}
                    onChange={(e) => {
                      setFin(e.target.value);
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

export function UpdateProgrammeFormModal({
  openModal,
  setOpenModal,
  libelle,
  setLibelle,
  debut,
  setDebut,
  fin,
  setFin,
  submit,
  pending,
}: {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  libelle: string;
  setLibelle: React.Dispatch<React.SetStateAction<string>>;
  debut: string;
  setDebut: React.Dispatch<React.SetStateAction<string>>;
  fin: string;
  setFin: React.Dispatch<React.SetStateAction<string>>;
  submit: () => void;
  pending: boolean;
}) {
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
                Modifier le programme
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                >
                  <Input
                    label="Évenement"
                    type="text"
                    value={libelle}
                    onChange={(e) => {
                      setLibelle(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Heure du début"
                    type="datetime-local"
                    value={debut}
                    onChange={(e) => {
                      setDebut(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Heure de la fin"
                    type="datetime-local"
                    value={fin}
                    onChange={(e) => {
                      setFin(e.target.value);
                    }}
                  />
                  <Button
                    className="bg-primary text-white mt-4"
                    isLoading={pending}
                    type="submit"
                  >
                    Créer
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
