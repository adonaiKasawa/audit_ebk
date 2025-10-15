"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import Alert from "../../alert";

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

  const handleSubmit = async () => {
    if (prayer) {
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
        setAlertMsg("Une erreur se produite lors de la création du prière.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
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
                  />
                  <div className="flex justify-end">
                    <Button
                      className="bg-primary text-white mt-4"
                      isLoading={loading}
                      type="submit"
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
