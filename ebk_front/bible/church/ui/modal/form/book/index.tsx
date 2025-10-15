import React from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useState } from "react";
import { Input } from "@heroui/input";

import Alert from "../../alert";

import { CropperImageUI } from "@/ui/cropperFile/image";
import { ItemVideos } from "@/app/lib/config/interface";
import CropperBooksUI from "@/ui/cropperFile/video";
import { base64DataToFile } from "@/app/lib/config/func";
import { UpdateFile, createFileApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export function AddBookFormModal({
  handleFindBooks,
}: {
  handleFindBooks: () => void;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [croppedBooksUrl, setCroppedBooksUrl] = useState<any>();
  const [titre, setTitre] = useState<string>("");
  const [auteur, setAuteur] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    if (titre && auteur && croppedImageUrl && croppedBooksUrl) {
      const formData = new FormData();
      const image = base64DataToFile(croppedImageUrl);

      formData.append("titre", titre);
      formData.append("auteur", auteur);
      formData.append("image", image);
      formData.append("livres", croppedBooksUrl);

      const create = await createFileApi(TypeContentEnum.livres, formData);

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
        handleFindBooks();
        setOpenModal(false);
        setTitre("");
        setAuteur("");
        setCroppedImageUrl("");
        setCroppedBooksUrl("");
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      setAlertMsg("Veuillez remplir tous les champs.");
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
        Ajouter un livre
      </Button>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        size="5xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ajouter un livre
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="">
                      <CropperImageUI
                        croppedImageUrl={croppedImageUrl}
                        setCroppedImageUrl={setCroppedImageUrl}
                      />
                    </div>
                    <div className="">
                      <CropperBooksUI
                        file={croppedBooksUrl}
                        setFile={(file) => {
                          setCroppedBooksUrl(file);
                        }}
                        typeFile="book"
                      />
                    </div>
                    <Input
                      label="Titre"
                      value={titre}
                      onChange={(e) => {
                        setTitre(e.target.value);
                      }}
                    />

                    <Input
                      label="Auteur"
                      value={auteur}
                      onChange={(e) => {
                        setAuteur(e.target.value);
                      }}
                    />
                  </div>
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

export function UpdateBooksFormModal({
  openModal,
  setOpenModal,
  book,
  handleFindBooks,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  book: ItemVideos;
  handleFindBooks: () => void;
}) {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [croppedBooksUrl, setCroppedBooksUrl] = useState<any>("");
  const [titre, setTitre] = useState<string>(book.titre);
  const [auteur, setAuteur] = useState<string>(book.auteur);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleUpdateSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    if (croppedImageUrl) {
      const image = base64DataToFile(croppedImageUrl);

      formData.append("image", image);
    }
    if (croppedBooksUrl) {
      formData.append("livres", croppedBooksUrl);
    }
    formData.append("titre", titre);
    formData.append("auteur", auteur);

    const update = await UpdateFile(TypeContentEnum.livres, book.id, formData);

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
      handleFindBooks();
      setOpenAlert(true);
      setAlertMsg("Le processus de modification s'est bien déroulé");
      setOpenModal(false);
    }
  };

  return (
    <div>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        size="5xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier le livre
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateSubmit();
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="">
                      <CropperImageUI
                        croppedImageUrl={croppedImageUrl}
                        setCroppedImageUrl={setCroppedImageUrl}
                      />
                    </div>
                    <div className="">
                      <CropperBooksUI
                        file={croppedBooksUrl}
                        setFile={(file) => {
                          setCroppedBooksUrl(file);
                        }}
                        typeFile="book"
                      />
                    </div>
                    <Input
                      label="Titre"
                      value={titre}
                      onChange={(e) => {
                        setTitre(e.target.value);
                      }}
                    />

                    <Input
                      label="Auteur"
                      value={auteur}
                      onChange={(e) => {
                        setAuteur(e.target.value);
                      }}
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
    </div>
  );
}
