"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Image } from "@heroui/image";

import Alert from "../../alert";
import { ImageGaleryItem } from "../../galery";
import DialogAction from "../../dialog";

import { UploadImagesUI } from "@/ui/cropperFile/image";
import { ItemPicture } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import { UpdateFile, createFileApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export function AddPictureFormModal({
  handleFindPictures,
}: {
  handleFindPictures: () => void;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<any[]>();
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("descrition", description);
    if (croppedImageUrl) {
      for (let i = 0; i < croppedImageUrl.length; i++) {
        const element = croppedImageUrl[i];

        formData.append("photos", element);
      }
    }
    const create = await createFileApi(TypeContentEnum.images, formData);

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
      handleFindPictures();
      setOpenModal(false);
      setCroppedImageUrl(undefined);
      setDescription("");
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
        Ajouter des images
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
                Ajouter des images
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 p-4">
                    <div>
                      <Textarea
                        className="w-full rounded"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                      />
                    </div>
                    <div className="">
                      <UploadImagesUI
                        key={"1"}
                        croppedImageUrl={croppedImageUrl}
                        setCroppedImageUrl={setCroppedImageUrl}
                      />
                    </div>
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

export function UpdatePictureFormModal({
  openModal,
  setOpenModal,
  picture,
  handleFindPictures,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  picture: ItemPicture;
  handleFindPictures: () => void;
}) {
  const [croppedImageUrl, setCroppedImageUrl] = useState<any[]>();
  const [description, setDescription] = useState<string>(picture.descrition);
  const [pictures, setPictures] = useState<string[]>(picture.photos);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pictureSelected, setPictureSelected] = useState<number>(0);

  const handleUpdateSubmit = async () => {
    const formData = new FormData();

    if (croppedImageUrl) {
      if (croppedImageUrl.length + pictures.length <= 5) {
        for (let i = 0; i < croppedImageUrl.length; i++) {
          const element = croppedImageUrl[i];

          formData.append("photos", element);
        }
        pictures.map((item) => formData.append("photoListe", item));
      } else {
        setOpenAlert(true);
        setAlertTitle("Impossible de dépasser la limite");
        setAlertMsg(
          "Le nombre d'images par publication est limité à 5. Veuillez supprimer les images actuelles ou les nouvelles pour respecter cette limite.",
        );

        return 0;
      }
    } else {
      pictures.map((item) => formData.append("photoListe", item));
    }
    formData.append("descrition", description);
    setLoading(true);
    const update = await UpdateFile(
      TypeContentEnum.images,
      picture.id,
      formData,
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
      handleResetForm();
      handleFindPictures();
      setOpenAlert(true);
      setAlertMsg("Le processus de modification s'est bien déroulé");
      setOpenModal(false);
    }
  };

  const handleDeletePictures = (index: number) => {
    setPictures(pictures.filter((item, i) => i !== index));
    if (index > 0) {
      setPictureSelected(pictureSelected - 1);
    }
  };

  const handleResetForm = () => {
    setPictures(picture.photos);
    setDescription(picture.descrition);
    setCroppedImageUrl(undefined);
  };

  return (
    <div>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        scrollBehavior={"inside"}
        size="5xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier les images
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateSubmit();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 p-4">
                    {pictures.length > 0 && (
                      <div className="w-full flex justify-center">
                        <Image
                          alt=""
                          className="object-contain rounded-lg"
                          src={`${file_url}${pictures[pictureSelected]}`}
                          style={{ height: 500 }}
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-12 gap-4">
                      {pictures.map((item, i) => (
                        <ImageGaleryItem
                          key={i}
                          deletePicture={handleDeletePictures}
                          focusIndex={pictureSelected}
                          index={i}
                          picture={item}
                          setFocus={setPictureSelected}
                        />
                      ))}
                    </div>
                    <div>
                      <Textarea
                        className="w-full rounded"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                      />
                    </div>
                    {pictures.length < 5 ? (
                      <div className="">
                        <UploadImagesUI
                          key={"1"}
                          croppedImageUrl={croppedImageUrl}
                          setCroppedImageUrl={setCroppedImageUrl}
                        />
                      </div>
                    ) : (
                      <div>
                        <p>
                          Veuillez supprimer les images précédemment
                          enregistrées pour en ajouter de nouvelles. Le nombre
                          d&apos;images par publication est limité à 5.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="bg-primary text-white mt-4"
                      isLoading={loading}
                      type="submit"
                    >
                      Modifier
                    </Button>
                    <Button
                      className="bg-danger text-white mt-4"
                      type="reset"
                      onPress={() => {
                        setOpenDialog(true);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
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
        <DialogAction
          action={async () => {
            handleResetForm();
          }}
          dialogBody={
            <p>
              Pourriez-vous confirmer que vous souhaitez annuler toutes vos
              modifications ?
            </p>
          }
          dialogTitle={"Avertisment !"}
          isOpen={openDialog}
          onClose={() => {
            setOpenDialog(false);
          }}
          onOpen={() => {
            setOpenDialog(true);
          }}
        />
      </Modal>
    </div>
  );
}
