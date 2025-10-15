"use client";
import React from "react";
import { GoUpload } from "react-icons/go";

export default function CropperFileUI({
  file,
  setFile,
  typeFile,
}: {
  file: any;
  setFile: (file: File, previewFile?: string) => any;
  typeFile: string;
}) {
  const handleOnChange = (event: React.ChangeEvent) => {
    const reader = new FileReader();
    const { files } = event.target as HTMLInputElement;

    if (files && files.length !== 0) {
      const file = files[0];

      reader.onload = () => {
        setFile(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`max-w-full items-center`}>
      <div
        className={`max-w-full p-4 rounded-lg shadow-md overflow-hidden items-center ${file && "bg-primary"}`}
      >
        <div
          className={`max-w-full rounded-lg items-center text-center cursor-pointer`}
          id="image-preview"
        >
          <div className={`flex flex-col justify-center items-center`}>
            <input
              accept={
                typeFile === "videos"
                  ? "video/*"
                  : typeFile === "audios"
                    ? "audio/*"
                    : "pdf"
              }
              className="hidden"
              id={`upload_${typeFile}`}
              type="file"
              // value={file}
              onChange={handleOnChange}
            />
            <GoUpload size={28} />

            <label className="cursor-pointer" htmlFor={`upload_${typeFile}`}>
              <h5 className="mb-2 text-xl font-bold tracking-tight">
                Telecharger {typeFile === "videos" && "une video"}
                {typeFile === "audios" && "un audio"}{" "}
                {typeFile === "book" && "un livre"}
              </h5>
              <p className="font-normal text-sm md:px-6">
                format <br />{" "}
                <b>
                  {typeFile === "videos"
                    ? "mp4, mkv, mov, ou mpeg"
                    : typeFile === "audios"
                      ? "mp3, wav, ogg, mid,  avi, aac"
                      : "pdf"}
                </b>
                .
              </p>
              <span className="z-50" id="filename" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
