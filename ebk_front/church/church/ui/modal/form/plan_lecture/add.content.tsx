"use client";

import React, { useState } from "react";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";
import { Image } from "@heroui/image";

import Alert from "../../alert";

import { opt, Option, SectionTitles } from ".";

import { createContentBibleStudyApi } from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";
import { DonwLoadIcon, LoadVideoIcon } from "@/ui/icons";

export default function BiblePlanLectureAddContentFormModal({
  id_bibleStudy,
  handleFindBiblestudy,
}: {
  id_bibleStudy: number;
  handleFindBiblestudy: () => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [optionsSelected, setOptionsSelected] = useState<Option[]>([opt[0]]);
  const [loading, setLoading] = useState(false);
  const [sectionTitle, setSectionTitle] = useState<SectionTitles>({});

  const addOptionSection = () => {
    if (optionsSelected.length < 10) {
      const nextOption = opt.find((item) => {
        return !optionsSelected.some((selected) => selected.id === item.id);
      });

      if (nextOption) {
        setOptionsSelected([...optionsSelected, { ...nextOption }]);
      }
    }
  };

  const handleSubmit = async () => {
    const Erreur: string[] = [];

    for (const option of optionsSelected) {
      const formData = new FormData();

      if (option.imageUrl instanceof File) {
        // const img = base64DataToFile(option.imageUrl)
        formData.append(`image`, option.imageUrl);
      }
      if (option.contentUrl instanceof File) {
        formData.append(`content`, option.contentUrl);
      }
      if (option.fileType) {
        formData.append(`typeContente`, option.fileType);
      }
      if (sectionTitle[option.id]) {
        formData.append(`titre`, sectionTitle[option.id]);
      }
      setLoading(true);
      const res = await createContentBibleStudyApi(formData, id_bibleStudy);

      setLoading(false);

      if (res.hasOwnProperty("statusCode") && res.hasOwnProperty("message")) {
        if (typeof res.message === "object") {
          let message = "";

          res.message.forEach((item: string) => {
            message += `${item} \n`;
          });
          Erreur.push(message);
        } else {
          Erreur.push(res.message);
        }
      }
    }
    setLoading(false);
    if (Erreur.length > 0) {
      setOpenAlert(true);
      let message = "";

      Erreur.map((item: string) => (message += `${item} \n`));
      setAlertMsg(message);
      setAlertTitle("Une erreur s'est produite");
    } else {
      setOpenAlert(true);
      setAlertMsg(
        "Tous les cours ont été ajoutés à votre formation avec succès.",
      );
      setAlertTitle("Ajout réussi!");
      await handleFindBiblestudy();
      setOpenModal(false);
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
        Ajouter un titre à la formation
      </Button>

      <Modal
        backdrop={"blur"}
        isOpen={openModal}
        scrollBehavior="inside"
        size="5xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ajouter du contenu dans votre formation
              </ModalHeader>
              <ModalBody>
                {optionsSelected.map((item) => (
                  <div key={item.id}>
                    <CreateSectionContent
                      key={item.id}
                      option={item}
                      optionsSelected={optionsSelected}
                      sectionTitle={sectionTitle}
                      setOptionsSelected={setOptionsSelected}
                      setSectionTitle={setSectionTitle}
                    />
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button onPress={addOptionSection}>Ajouter une section</Button>
                <Button
                  color="primary"
                  isLoading={loading}
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  <p className="text-white">Envoyer</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
    </>
  );
}

const CreateSectionContent = ({
  option,
  setOptionsSelected,
  setSectionTitle,
  sectionTitle,
}: {
  option: Option;
  optionsSelected: Option[];
  setOptionsSelected: React.Dispatch<React.SetStateAction<Option[]>>;
  sectionTitle: SectionTitles;
  setSectionTitle: React.Dispatch<React.SetStateAction<SectionTitles>>;
}) => {
  const { id, imageUrl, fileName, fileSelected, fileType, contentUrl } = option;

  const handleFileChange = (event: any, optionId: number) => {
    const file = typeof event === "string" ? event : event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // const fileUrl = reader.result ? reader.result.toString() : "";

        setOptionsSelected((prevOptions) => {
          return prevOptions.map((option) => {
            if (option.id === optionId) {
              if (file.type.startsWith("image/")) {
                return { ...option, imageUrl: file };
              } else if (
                file.type.startsWith("audio/") ||
                file.type.startsWith("video/") ||
                file.type === "application/pdf"
              ) {
                return {
                  ...option,
                  contentUrl: file,
                  fileSelected: true,
                  fileType: file.type,
                  fileName: file.name,
                };
              }
            }

            return option;
          });
        });
      };
      if (typeof file !== "string") {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleTitleChange = (event: any, optionId: any) => {
    const newTitle = event.target.value;

    setSectionTitle((prevTitles) => ({
      ...prevTitles,
      [optionId]: newTitle,
    }));
  };

  const removeOptionSection = (idToRemove: number) => {
    setOptionsSelected((currentOptions) =>
      currentOptions.filter((option) => option.id !== idToRemove),
    );
  };

  const resetOption = (optionId: number) => {
    setOptionsSelected((prevOptions) => {
      return prevOptions.map((option) => {
        if (option.id === optionId) {
          return {
            ...option,
            imageUrl: "",
            contentUrl: "",
            fileSelected: false,
          };
        }

        return option;
      });
    });

    setSectionTitle((prevTitles) => {
      const newTitles = { ...prevTitles };

      newTitles[optionId] = "";

      return newTitles;
    });
  };

  return (
    <div key={option.id} className="options">
      <p>Contenus {option.id}</p>
      <div className="mt-4 mb-4">
        <div className="mt-4 mb-4 rounded-lg">
          <div className="flex flex-col">
            <Tabs
              aria-label="Options"
              disabledKeys={fileSelected ? ["audio", "videos", "livre"] : []}
              variant="underlined"
            >
              <Tab
                key="videos"
                title={
                  <div className="flex items-center content-center space-x-2">
                    <LiaPhotoVideoSolid />
                    <span>Videos</span>
                  </div>
                }
              />
            </Tabs>
            <div className="grid grid-cols-2 gap-4">
              <label
                className="flex flex-col rounded-lg border-2 items-center justify-center cursor-pointer h-52"
                htmlFor={`imageLoad${id}`}
              >
                <input
                  className="hidden"
                  id={`imageLoad${id}`}
                  name={`imageLoad${id}`}
                  type="file"
                  onChange={(event) => handleFileChange(event, id)}
                />
                {!imageUrl ? (
                  <>
                    <DonwLoadIcon />
                    <span className="mt-2 text-base leading-normal">
                      Sélectionner l&apos;image
                    </span>
                  </>
                ) : (
                  <Image
                    alt={`Option ${id}`}
                    src={
                      typeof imageUrl === "string"
                        ? imageUrl
                        : URL.createObjectURL(imageUrl)
                    }
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: "1rem",
                      objectFit: "cover",
                    }}
                  />
                )}
              </label>
              {/* <CropperImageUI key={id} croppedImageUrl={imageUrl} setCroppedImageUrl={(e) => { handleFileChange(e, id) }} /> */}
              <label
                className="flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer h-52"
                htmlFor={`videoLoad${id}`}
              >
                <input
                  accept="video/*"
                  className="hidden"
                  id={`videoLoad${id}`}
                  name={`videoLoad${id}`}
                  type="file"
                  onChange={(event) => handleFileChange(event, id)}
                />
                {!contentUrl && (
                  <>
                    <DonwLoadIcon />
                    <span className="text-base leading-normal">
                      Sélectionner le fichier
                    </span>
                  </>
                )}

                {contentUrl && (
                  <>
                    {fileType.startsWith("video/") && (
                      <>
                        <LoadVideoIcon />
                        <span className="mt-2 text-xs font-mono font-thin tracking-tighter leading-normal text-center p-2">
                          {fileName}
                        </span>
                      </>
                    )}
                  </>
                )}
              </label>
            </div>

            <div>
              <Input
                className="mt-4 mb-4"
                name={`titre_section_${id}`}
                placeholder="Entrer le titre de la section"
                type="text"
                value={sectionTitle[id] || ""}
                variant="bordered"
                onChange={(e) => handleTitleChange(e, id)}
              />
              <div>
                <Button
                  className="mx-2"
                  onClick={() => removeOptionSection(id)}
                >
                  Supprimer
                </Button>
                <Button className="mx-2" onClick={() => resetOption(id)}>
                  Reprendre
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
