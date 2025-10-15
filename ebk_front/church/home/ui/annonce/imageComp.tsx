"use client";

import React, { useState } from "react";
import Cropper from "react-easy-crop";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Slider } from "@heroui/slider";
import { Button } from "@heroui/button";
import { Image as HeroUiImage } from "@heroui/image";

import Alert from "../modal/alert";

import { createAnnonceApi } from "@/app/lib/actions/annonce/annonce.req";
import { base64DataToFile } from "@/app/lib/config/func";

export default function ImageComponent({ idChurch }: { idChurch: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio] = useState(16 / 9);
  const [croppedArea, setCroppedArea] = useState(null);
  const [image, setImage] = useState("");
  const [imgAfterCrop, setImgAfterCrop] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (croppedImageUrl) {
      const formData = new FormData();

      const blobImage = base64DataToFile(croppedImageUrl);

      formData.append("contente", blobImage);

      setLoading(true);
      const response = await createAnnonceApi(formData, idChurch);

      setLoading(false);
      if (
        response.hasOwnProperty("statusCode") &&
        response.hasOwnProperty("message")
      ) {
        setOpenAlert(true);
        setAlertTitle("Erreur");
        if (typeof response.message === "object") {
          let message = "";

          response.message.map((item: string) => (message += `${item} \n`));
          setAlertMsg(message);
        } else {
          setAlertMsg(response.message);
        }
      } else {
        setOpenAlert(true);
        setAlertTitle("Création réussi");
        setAlertMsg("La création de l'annonce a réussi.");
      }
    }
  };

  const resetImage = () => {
    setImage("");
    setImgAfterCrop("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedImageUrl("");
  };

  // const onAspectRationChange = (e: any) => {
  //   setAspectRatio(e.target.value);
  // };

  const handleSliderChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;

    setZoom(newValue);
  };

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any,
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onImageSelected = (selectedImg: any) => {
    setImage(selectedImg);
  };

  const handleOnChange = (event: React.ChangeEvent) => {
    const reader = new FileReader();
    const { files } = event.target as HTMLInputElement;

    if (files && files.length !== 0) {
      reader.onload = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onCropDone = (imgCroppedArea: any) => {
    const canvasEl = document.createElement("canvas");

    canvasEl.width = imgCroppedArea.width;
    canvasEl.height = imgCroppedArea.height;

    const context = canvasEl.getContext("2d");

    let imageObj1 = new Image();

    imageObj1.src = image;
    imageObj1.onload = () => {
      context?.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height,
      );

      const dataURL = canvasEl.toDataURL("image/jpeg");

      setImgAfterCrop(dataURL);
    };
  };

  const onSaveCroppedImage = () => {
    setCroppedImageUrl(imgAfterCrop);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="max-w items-center">
          {croppedImageUrl ? (
            <>
              <HeroUiImage
                alt="55s8d"
                className="mb-4 relative max-h-screen mx-auto justify-center"
                src={croppedImageUrl}
                style={{ borderRadius: "10px" }}
              />
            </>
          ) : (
            <>
              <div className="max-w p-4 rounded-lg shadow-md overflow-hidden items-center">
                <div className="max-w items-center">
                  <div
                    className="max-w-full p-4 border-dashed border-2 rounded-lg items-center text-center cursor-pointer"
                    id="image-preview"
                  >
                    {image ? (
                      <div
                        className="relative max-h-screen mx-auto justify-center"
                        style={{ width: 470, height: 460 }}
                      >
                        <Cropper
                          aspect={aspectRatio}
                          crop={crop}
                          image={image}
                          style={{
                            containerStyle: {
                              width: "auto",
                              height: "auto",
                            },
                          }}
                          zoom={zoom}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>
                    ) : (
                      <>
                        <input
                          accept="image/*"
                          className="hidden"
                          id="upload"
                          type="file"
                          onChange={handleOnChange}
                        />
                        <label className="cursor-pointer" htmlFor="upload">
                          <svg
                            className="w-8 h-8 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <h5 className="mb-2 text-xl font-bold tracking-tight ">
                            Telecharger l&apos;image
                          </h5>
                          <p className="font-normal text-sm md:px-6">
                            Choisir une photo qui au plus{" "}
                            <b className="">15 mb</b>
                          </p>
                          <p className="font-normal text-sm md:px-6">
                            et au format <b className="">JPG, PNG</b>.
                          </p>
                          <span className="  z-50" id="filename" />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {image && (
                <>
                  {/* slider */}
                  <div className="flex justify-center mt-2 mb-2">
                    <Slider
                      aria-label="Zoom"
                      className="max-w"
                      maxValue={3}
                      minValue={1}
                      size="sm"
                      step={0.01}
                      value={zoom}
                      onChange={handleSliderChange}
                    />
                  </div>

                  {/* Bouton */}
                  <div className="flex justify-center mt-4 mb-4">
                    <Button
                      onPress={() => {
                        onCropDone(croppedArea);
                        onOpen();
                      }}
                    >
                      Voir le resultat
                    </Button>
                    <Button className="ml-2" onPress={resetImage}>
                      Reset
                    </Button>
                    <Modal
                      isOpen={isOpen}
                      size="lg"
                      onOpenChange={onOpenChange}
                    >
                      <ModalContent>
                        {(onClose: () => void) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              Resultat de votre image
                            </ModalHeader>
                            <ModalBody>
                              {imgAfterCrop && (
                                <HeroUiImage
                                  alt="Image recadrée"
                                  src={imgAfterCrop}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "80%",
                                    objectFit: "contain",
                                  }}
                                />
                              )}
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                              >
                                Fermer
                              </Button>
                              <Button
                                color="success"
                                variant="light"
                                onPress={() => {
                                  onSaveCroppedImage();
                                  onClose();
                                }}
                              >
                                Enregistrer
                              </Button>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <Submit loading={loading} />
        </div>
      </form>
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

function Submit({ loading }: { loading: boolean }) {
  return (
    <Button aria-disabled={loading} isLoading={loading} type="submit">
      {loading ? "En cours..." : "Envoyer"}
    </Button>
  );
}
