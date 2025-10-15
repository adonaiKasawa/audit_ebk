"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import Alert from "../modal/alert";

import { creatPrayerWallApi } from "@/app/lib/actions/prayer-wall/prayer.req";

export function CreatePrayerWallFormModal({
  handleFindPrayerWall,
}: {
  handleFindPrayerWall: () => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [prayer, setPrayer] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const MAX_LENGTH = 300;

  const handleSubmit = async () => {
    if (!prayer) {
      setAlertMsg("Le champ est obligatoire.");
      setOpenAlert(true);
      return;
    }

    if (prayer.length > MAX_LENGTH) {
      setAlertMsg(`La prière ne doit pas dépasser ${MAX_LENGTH} caractères.`);
      setOpenAlert(true);
      return;
    }

    setLoading(true);
    const create = await creatPrayerWallApi({ prayer });
    setLoading(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      !create.hasOwnProperty("message")
    ) {
      handleFindPrayerWall();
      setPrayer("");
      setOpenModal(false);
    } else {
      setAlertMsg("Une erreur s'est produite lors de la création de la prière.");
      setOpenAlert(true);
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Ajouter une prière
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
                Ajouter une prière
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Textarea
                    className="col-span-12 md:col-span-6"
                    label="Votre prière"
                    placeholder="Entrer la prière"
                    value={prayer}
                    variant="bordered"
                    onChange={(e) => setPrayer(e.target.value)}
                    maxLength={MAX_LENGTH}
                  />
                  <p className="text-sm text-gray-500 text-right">
                    {prayer.length}/{MAX_LENGTH}
                  </p>
                  <div className="flex justify-end">
                    <Button
                      className="bg-primary text-white mt-4"
                      isLoading={loading}
                      type="submit"
                      isDisabled={!prayer || prayer.length > MAX_LENGTH}
                    >
                      Ajouter
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
        <Alert
          alertBody={<p>{alertMsg}</p>}
          alertTitle={"Erreur"}
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
