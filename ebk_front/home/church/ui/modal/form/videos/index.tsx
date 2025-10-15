import React from "react";
import { useState } from "react";
import { IoCodeSlashOutline } from "react-icons/io5";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";

import Alert from "../../alert";

import { CropperImageUI } from "@/ui/cropperFile/image";
import CropperVideosUI from "@/ui/cropperFile/video";
// import { IFramePlayer } from "@/app/(overview)/videos/[id]";
import { VideoIcon } from "@/ui/icons";
import { base64DataToFile } from "@/app/lib/config/func";
import { createFileApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { IFramePlayer } from "@/ui/player/iframe.player";

export function AddVideosFormModal({
  handleFindVideos,
}: {
  handleFindVideos: () => void;
  id_eglise: number;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [croppedVideosUrl, setCroppedVideosUrl] = useState<any>();
  const [titre, setTitre] = useState<string>("");
  const [auteur, setAuteur] = useState<string>("");
  const [iframe, setIframe] = useState<string>("");

  const [selected, setSelected] = useState<string | number>("videos");
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    const image = base64DataToFile(croppedImageUrl);

    formData.append("titre", titre);
    formData.append("auteur", auteur);
    formData.append("image", image);
    // if (selected === "videos") {
    formData.append(
      `${selected === "videos" ? "videos" : "iframe"}`,
      selected === "videos" ? croppedVideosUrl : iframe,
    );
    // } else if (selected === "iframe") {

    // }
    formData.append("source", selected === "videos" ? "1" : "0");

    const create = await createFileApi(TypeContentEnum.videos, formData);

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
        setOpenModal(false);
      }
    } else {
      handleFindVideos();
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
        Ajouter une vidéos
      </Button>
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
                Ajouter une vidéos
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="col-span-2 flex justify-center">
                      <Tabs
                        aria-label="Options"
                        className="tabs-centered"
                        selectedKey={selected}
                        onSelectionChange={(k) => {
                          setSelected(k);
                        }}
                      >
                        <Tab
                          key="videos"
                          title={
                            <div className="flex items-center space-x-2">
                              <p>Vidéos</p>
                              <VideoIcon />
                            </div>
                          }
                        />
                        <Tab
                          key="iframe"
                          title={
                            <div className="flex items-center space-x-2">
                              <p>Iframe</p>
                              <IoCodeSlashOutline size={30} />
                            </div>
                          }
                        />
                      </Tabs>
                    </div>
                    <div className="">
                      <CropperImageUI
                        croppedImageUrl={croppedImageUrl}
                        setCroppedImageUrl={setCroppedImageUrl}
                      />
                    </div>
                    <div className="">
                      {selected === "videos" ? (
                        <CropperVideosUI
                          file={croppedVideosUrl}
                          setFile={(file) => {
                            setCroppedVideosUrl(file);
                          }}
                          typeFile="videos"
                        />
                      ) : (
                        <div>
                          <IFramePlayer iframe={iframe} />
                          <Input
                            label="Code d'integration (iframe)"
                            value={iframe}
                            onChange={(e) => {
                              setIframe(e.target.value);
                            }}
                          />
                        </div>
                      )}
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
