"use client";

import React from "react";
import { useState } from "react";

import Alert from "../../alert";

import { UploadImagesUI } from "@/ui/cropperFile/image";

export function AddPicturePlanLectureFormModal({}: {
  handleFindPictures: Function;
}) {
  const [croppedImageUrl, setCroppedImageUrl] = useState<any[]>();

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg] = useState<string>("");
  const [alertTitle] = useState<string>("");

  // const handleSubmit = async () => {
  //   if (croppedImageUrl) {
  //     handleFindPictures(croppedImageUrl[0]);
  //     setOpenModal(false);
  //   }
  // };

  return (
    <div>
      <div className="flex flex-col gap-1">Ajouter Image</div>
      <div>
        <div className="grid grid-cols-1 gap-4 p-4">
          <div className="">
            <UploadImagesUI
              key={"1"}
              croppedImageUrl={croppedImageUrl}
              setCroppedImageUrl={setCroppedImageUrl}
            />
          </div>
        </div>
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
