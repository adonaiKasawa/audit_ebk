import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Dispatch, SetStateAction, useState } from "react";
import Cropper from "react-easy-crop";
import { CiTrash } from "react-icons/ci";
import { GoUpload } from "react-icons/go";
import { Image as HerouiImage } from "@heroui/image";

import Alert from "@/ui/modal/alert";

export function CropperImageUI({
  croppedImageUrl,
  setCroppedImageUrl,
}: {
  croppedImageUrl: string;
  setCroppedImageUrl: Dispatch<SetStateAction<string>>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio] = useState(16 / 9);
  const [croppedArea, setCroppedArea] = useState(null);
  const [image, setImage] = useState(croppedImageUrl);
  const [viewImage, setViewImage] = useState<boolean>(false);

  const resetImage = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedImageUrl("");
    setViewImage(false);
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
    setCroppedArea(croppedAreaPixels);
    onCropDone(croppedAreaPixels);
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

      setCroppedImageUrl(dataURL);
    };
  };

  return (
    <div className="max-w-full items-center">
      <div className="max-w-full p-4 rounded-lg shadow-md overflow-hidden items-center">
        <div
          className="max-w-full rounded-md items-center text-center cursor-pointer"
          id="image-preview"
        >
          {image ? (
            <>
              {viewImage ? (
                <div className="flex justify-center bg-blue-500">
                  <HerouiImage
                    alt="Image recadrée"
                    src={croppedImageUrl}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80%",
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
          ) : (
            <div className="flex flex-col justify-center items-center">
              <input
                accept="image/*"
                className="hidden"
                id="upload"
                type="file"
                onChange={handleOnChange}
              />
              <GoUpload size={28} />

              <label className="cursor-pointer" htmlFor="upload">
                <h5 className="mb-2 text-xl font-bold tracking-tight">
                  Telecharger l&apos;image
                </h5>
                <p className="font-normal text-sm md:px-6">
                  format <br /> <b>jpeg, jpg, png</b>
                </p>
                <span className="z-50" id="filename" />
              </label>
            </div>
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
              <Button className="ml-2" onPress={resetImage}>
                récommencer
              </Button>
              <Button
                onPress={() => {
                  onCropDone(croppedArea);
                  setViewImage(true);
                }}
              >
                voir l&apos;image
              </Button>
              <div>
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
                  <span className="z-50" id="filename" />
                  <span className="sr-only">Téléverser un fichier</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function UploadImagesUI({
  croppedImageUrl,
  setCroppedImageUrl,
}: {
  croppedImageUrl: any;
  setCroppedImageUrl: Dispatch<SetStateAction<any>>;
}) {
  const [image] = useState<string[]>();
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleOnChange = async (event: React.ChangeEvent) => {
    const { files } = event.target as HTMLInputElement;

    if (files && files.length !== 0) {
      if (files.length > 5) {
        setOpenAlert(true);
      } else {
        setCroppedImageUrl(files);
        // let r: string[] = []
        // for (let i = 0; i < files.length; i++) {
        //   let reader = new FileReader()
        //   const element = files[i];
        //   setTimeout(() => {
        //     reader.onload = async () => {
        //       console.log(reader.result);
        //       r.push(reader.result as string);
        //     };
        //     reader.readAsDataURL(element);
        //   }, 1000)
        // }
        // console.log("r", r.length);
        // if (r.length > 0) {
        //   setImage(r);
        // }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        {!croppedImageUrl ? (
          <div className="max-w-full items-center">
            <div
              className={`max-w-full p-4 rounded-lg shadow-md overflow-hidden items-center`}
            >
              <div
                className="max-w-full rounded-md items-center text-center cursor-pointer"
                id="image-preview"
              >
                <div className="flex flex-col justify-center items-center">
                  <input
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="upload"
                    type="file"
                    onChange={handleOnChange}
                  />
                  <GoUpload size={28} />
                  <label className="cursor-pointer" htmlFor="upload">
                    <h5 className="mb-2 text-xl font-bold tracking-tight">
                      Telecharger l&apos;image
                    </h5>
                    <p className="font-normal text-sm md:px-6">
                      format <br /> <b>jpeg, jpg, png</b>
                    </p>
                    <span className="z-50" id="filename" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-full items-center">
            <div className="max-w-full p-4 rounded-lg shadow-md overflow-hidden items-center">
              <div className="flex justify-between">
                <p className="">
                  {croppedImageUrl.length} image
                  {croppedImageUrl.length > 1 && "s"} séléctionner
                </p>
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  variant="bordered"
                  onClick={() => {
                    setCroppedImageUrl(undefined);
                  }}
                >
                  <CiTrash size={24} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {image &&
          image.map((item) => (
            <HerouiImage
              key={item}
              alt="Image recadrée"
              src={item}
              style={{
                width: 100,
                height: 100,
                objectFit: "contain",
              }}
            />
          ))}
      </div>
      <Alert
        alertBody={<p>Vous devez sélectionner aumoins 5 images</p>}
        alertTitle={"Erreur"}
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
