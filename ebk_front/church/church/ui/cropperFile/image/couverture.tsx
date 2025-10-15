import { Session } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@heroui/slider";
import { Button } from "@heroui/button";
import { Image as HerouiImage } from "@heroui/image";

import Alert from "@/ui/modal/alert";
import { base64DataToFile } from "@/app/lib/config/func";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { updateChurcheApi } from "@/app/lib/actions/church/church";

export function CropperCouverturImageUI({
  croppedImageUrl,
  setCroppedImageUrl,
  session,
}: {
  croppedImageUrl: string;
  setCroppedImageUrl: Dispatch<SetStateAction<string>>;
  session: Session | null;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio] = useState(16 / 4);
  // const [croppedArea, setCroppedArea] = useState(null);
  const [image, setImage] = useState(croppedImageUrl);
  const [viewImage, setViewImage] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const resetImage = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setViewImage(false);
  };
  const cancelCropImage = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setViewImage(false);
    setCroppedImageUrl("");
    setImage("");
  };

  const handleSliderChange = (value: number | number[]) => {
    if (croppedImageUrl) {
      setViewImage(false);
    }
    const newValue = Array.isArray(value) ? value[0] : value;

    setZoom(newValue);
  };

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any,
  ) => {
    // setCroppedArea(croppedAreaPixels);
    onCropDone(croppedAreaPixels);
  };

  // const onImageSelected = (selectedImg: any) => {
  //   setImage(selectedImg);
  // };

  // const handleOnChange = (event: React.ChangeEvent) => {
  //   const reader = new FileReader();
  //   const { files } = event.target as HTMLInputElement;

  //   if (files && files.length !== 0) {
  //     reader.onload = () => {
  //       onImageSelected(reader.result as string);
  //     };
  //     reader.readAsDataURL(files[0]);
  //   }
  // };

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

      setCroppedImageUrl(dataURL);
    };
  };

  const handleSubmit = async () => {
    if (
      session &&
      session.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE
    ) {
      if (croppedImageUrl) {
        const formData = new FormData();
        const image = base64DataToFile(croppedImageUrl);

        formData.append("couverture", image);
        setLoading(true);
        const update = await updateChurcheApi(
          formData,
          session.user.eglise.id_eglise,
        );

        setLoading(false);
        if (
          !update.hasOwnProperty("StatusCode") &&
          !update.hasOwnProperty("message")
        ) {
          setOpenAlert(true);
          setAlertTitle("Modification réussi!");
          setAlertMsg(
            "La modification de la photo de couverture de l'église a été enregistrée avec succès.",
          );
          // router.push('/church');
          document.location = "/church";
        } else {
          setOpenAlert(true);
          setAlertTitle("Error dans la modification!");
          if (typeof update.message === "object") {
            let message = "";

            update.message.map((item: string) => (message += `${item} \n`));
            setAlertMsg(message);
          } else {
            setAlertMsg(update.message);
          }
        }
      } else {
        setOpenAlert(true);
        setAlertTitle("Error dans la modification!");
        setAlertMsg("Veuillez choisir une image.");
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Error dans la modification!");
      setAlertMsg("Vous n'avez pas la permission d'effectuer cette action.");
    }
  };

  return (
    <div className="max-w-full items-center">
      <div className="max-w-full p-4 rounded-lg shadow-md overflow-hidden items-center">
        <div
          className="max-w-full rounded-md items-center text-center cursor-pointer"
          id="image-preview"
        >
          {image && (
            <>
              {viewImage ? (
                <div className="flex justify-center">
                  <HerouiImage
                    alt="Image recadrée"
                    src={croppedImageUrl}
                    style={{
                      maxWidth: "100%",
                      height: 250,
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : (
                <div
                  className="relative h-full w-full mx-auto justify-center"
                  style={{ width: "100%", height: 500 }}
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
              )}
            </>
          )}
        </div>
        {image && (
          <div>
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

            <div className="flex justify-center mt-4 gap-4">
              <Button
                className="ml-2"
                color="warning"
                variant="bordered"
                onPress={resetImage}
              >
                Récommencer
              </Button>

              <Button
                color="danger"
                variant="bordered"
                onPress={cancelCropImage}
              >
                Annuler la modification
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                onPress={handleSubmit}
              >
                Enregistre la photo de couverture
              </Button>
            </div>
          </div>
        )}
      </div>
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
    </div>
  );
}
