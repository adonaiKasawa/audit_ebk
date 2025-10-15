"use client";

import { Button } from "@heroui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import Alert from "../../alert";

import { createCommuniqueApi } from "@/app/lib/services/api/churcheApi";
import { CommuniquesPaginated } from "@/app/lib/config/interface";

export function AddCommuniqueFormModal({
  stCommuniques,
  setStCommuniques,
}: {
  stCommuniques: CommuniquesPaginated | undefined;
  setStCommuniques: Dispatch<SetStateAction<CommuniquesPaginated | undefined>>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [communique, setCommunique] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (communique) {
      setLoading(true);
      const create = await createCommuniqueApi({ communique });

      setLoading(false);
      if (create) {
        if (stCommuniques) {
          setStCommuniques({
            ...stCommuniques,
            items: [create, ...stCommuniques.items],
          });
        } else {
          setStCommuniques({
            items: [create],
            links: {
              first: "reload",
              previous: "reload",
              next: "reload",
              last: "reload",
            },
            meta: {
              totalItems: 1,
              itemCount: 1,
              itemsPerPage: 1,
              totalPages: 1,
              currentPage: 1,
            },
          });
        }
        setCommunique("");
        setOpenModal(false);
      } else {
        setAlertMsg(
          "Une erreur se produite lors de la création de commuiqués.",
        );
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
        variant="flat"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Créer un communiqués
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
                Créer un communiqués
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <textarea
                    className="bg-default-100 rounded-lg p-2 mt-4 w-full"
                    placeholder="Déscription"
                    rows={4}
                    value={communique}
                    onChange={(e) => {
                      setCommunique(e.target.value);
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
