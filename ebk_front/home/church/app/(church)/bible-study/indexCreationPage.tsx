"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { IoBookSharp } from "react-icons/io5";
import { LuFileAudio } from "react-icons/lu";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";

import {
  createBibleStudyApi,
  createContentBibleStudyApi,
} from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";
import { base64DataToFile } from "@/app/lib/config/func";
import { cn } from "@/app/lib/utils";
import Alert from "@/ui/modal/alert";

interface Option {
  id: number;
  content: JSX.Element;
  imageUrl: string | File;
  contentUrl: string | File;
  fileSelected: Boolean;
  fileType: string;
  fileName: string;
}

type SectionTitles = {
  [key: number]: string;
};

export default function IndexCreationPage() {
  const opt = [
    {
      id: 1,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 2,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 3,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 4,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 5,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 6,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 7,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 8,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 9,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
    {
      id: 10,
      content: <></>,
      imageUrl: "",
      contentUrl: "",
      fileSelected: false,
      fileType: "",
      fileName: "",
    },
  ];
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMsg, setAlertMsg] = useState<string>("");

  const [optionListe] = useState<Option[]>(opt);
  const [optionsSelected, setOptionsSelected] = useState<Option[]>([]);

  const handleFileChange = (event: any, optionId: number) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileUrl = reader.result ? reader.result.toString() : "";
        const blobImage = base64DataToFile(fileUrl);

        setOptionsSelected((prevOptions) => {
          return prevOptions.map((option) => {
            if (option.id === optionId) {
              if (file.type.startsWith("image/")) {
                return { ...option, imageUrl: blobImage };
              } else if (
                file.type.startsWith("audio/") ||
                file.type.startsWith("video/") ||
                file.type === "application/pdf"
              ) {
                return {
                  ...option,
                  contentUrl: fileUrl,
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
      reader.readAsDataURL(file);
    }
  };

  const [sectionTitle, setSectionTitle] = useState<SectionTitles>({});

  const handleTitleChange = (event: any, optionId: any) => {
    const newTitle = event.target.value;

    setSectionTitle((prevTitles) => ({
      ...prevTitles,
      [optionId]: newTitle,
    }));
  };

  const createSectionContent = ({
    id,
    imageUrl,
    contentUrl,
    fileSelected,
    fileType,
    fileName,
  }: Option) => (
    <div key={id} className="options">
      <p>Contenus {id}</p>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-slate-600" />
      </span>

      <div className="mt-4 mb-4">
        <div className="rounded-lg">
          <div className="flex w-full items-center justify-center bg-grey-lighter">
            <label className="w-56 flex flex-col items-center px-4 py-6 text-blue rounded-lg shadow-lg tracking-wide uppercase border-dashed border-2 cursor-pointer">
              {!imageUrl && (
                <>
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="mt-2 text-base leading-normal">
                    Sélectionner l'image
                  </span>
                </>
              )}
              <input
                className="hidden"
                type="file"
                onChange={(event) => handleFileChange(event, id)}
              />
              {imageUrl && (
                <Image
                  alt={`Option ${id}`}
                  src={
                    typeof imageUrl === "string"
                      ? imageUrl
                      : URL.createObjectURL(imageUrl)
                  }
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "1rem",
                    objectFit: "cover",
                  }}
                />
              )}
            </label>
          </div>

          <div className="mt-4 mb-4 rounded-lg lg:col-span-2">
            <div className="flex w-full flex-col">
              <Tabs
                aria-label="Options"
                disabledKeys={fileSelected ? ["audio", "videos", "livre"] : []}
                variant="underlined"
              >
                <Tab
                  key="livre"
                  title={
                    <div className="flex items-center content-center space-x-2">
                      <IoBookSharp />
                      <span>Livres</span>
                    </div>
                  }
                />
                <Tab
                  key="audio"
                  title={
                    <div className="flex items-center content-center space-x-2">
                      <LuFileAudio />
                      <span>Audios</span>
                    </div>
                  }
                />
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
              <Card>
                <CardBody>
                  <div className="flex w-full items-center justify-center bg-grey-lighter">
                    <label className="w-full flex flex-col items-center px-4 py-6 text-blue rounded-lg border-dashed border-2 tracking-wide uppercase cursor-pointer">
                      {!contentUrl && (
                        <>
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                          </svg>
                          <span className="mt-2 text-base leading-normal">
                            Sélectionner le fichier
                          </span>
                        </>
                      )}
                      <input
                        className="hidden"
                        type="file"
                        onChange={(event) => handleFileChange(event, id)}
                      />
                      {contentUrl && (
                        <>
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[170px_1fr] lg:gap-4">
                            <div className="rounded-lg border-2">
                              <Image
                                alt={`Option ${id}`}
                                className="rounded-lg"
                                src={
                                  typeof imageUrl === "string"
                                    ? imageUrl
                                    : URL.createObjectURL(imageUrl)
                                }
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div className="h-32 rounded-lg border-2">
                              <label className="w-full flex flex-col items-center px-4 py-4 text-blue tracking-wide uppercase cursor-pointer">
                                {!contentUrl && (
                                  <>
                                    <svg
                                      className="w-8 h-8"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    <span className="mt-2 text-base leading-normal">
                                      Sélectionner le fichier
                                    </span>
                                  </>
                                )}
                                <input
                                  className="hidden"
                                  type="file"
                                  onChange={(event) =>
                                    handleFileChange(event, id)
                                  }
                                />
                                {contentUrl && (
                                  <>
                                    {fileType === "application/pdf" && (
                                      <>
                                        <svg
                                          className="bi bi-filetype-pdf"
                                          fill="currentColor"
                                          height="50"
                                          viewBox="0 0 16 16"
                                          width="50"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"
                                            fillRule="evenodd"
                                          />
                                        </svg>
                                        <span className="mt-2 text-xs font-mono font-thin tracking-tighter leading-normal">
                                          {fileName}
                                        </span>
                                      </>
                                    )}
                                    {fileType.startsWith("audio/") && (
                                      <>
                                        <svg
                                          enableBackground="new 0 0 512 512"
                                          height="50px"
                                          version="1.1"
                                          viewBox="0 0 512 512"
                                          width="50px"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g id="Layer_1" />
                                          <g id="Colors">
                                            <rect
                                              fill="#FFFFFF"
                                              height="267"
                                              stroke="#231F20"
                                              strokeMiterlimit="10"
                                              width="267"
                                              x="-779"
                                              y="-512"
                                            />
                                            <rect
                                              fill="#FBD50A"
                                              height="267"
                                              stroke="#231F20"
                                              strokeMiterlimit="10"
                                              width="267"
                                              x="-779"
                                              y="-244"
                                            />
                                            <rect
                                              fill="#C61934"
                                              height="267"
                                              stroke="#231F20"
                                              strokeMiterlimit="10"
                                              width="267"
                                              x="-779"
                                              y="23"
                                            />
                                            <rect
                                              fill="#96212C"
                                              height="267"
                                              stroke="#231F20"
                                              strokeMiterlimit="10"
                                              width="267"
                                              x="-779"
                                              y="290"
                                            />
                                            <rect
                                              fill="#202C3C"
                                              height="267"
                                              stroke="#231F20"
                                              strokeMiterlimit="10"
                                              width="267"
                                              x="-779"
                                              y="557"
                                            />
                                            <rect
                                              fill="#ED1C24"
                                              height="267"
                                              stroke="#231F20"
                                              strokeMiterlimit="10"
                                              width="267"
                                              x="-779"
                                              y="825"
                                            />
                                          </g>
                                          <g id="Icon">
                                            <ellipse
                                              cx="258.375"
                                              cy="255.649"
                                              fill="#FBD50A"
                                              rx="254.776"
                                              ry="252.774"
                                            />
                                          </g>
                                          <g id="Layer_4">
                                            <path
                                              d="M405.961,310.277   c6.754-17.672,10.454-36.853,10.454-56.898c0-88.042-71.372-159.414-159.414-159.414S97.586,165.337,97.586,253.379   c0,20.044,3.699,39.224,10.452,56.894"
                                              fill="none"
                                              stroke="#FDFEFF"
                                              strokeLinecap="round"
                                              strokeMiterlimit="10"
                                              strokeWidth="20"
                                            />
                                            <path
                                              d="M370.531,141.469   C341.621,112.143,301.433,93.964,257,93.964c-44.942,0-85.541,18.598-114.519,48.517"
                                              fill="none"
                                              stroke="#202C3C"
                                              strokeLinecap="round"
                                              strokeMiterlimit="10"
                                              strokeWidth="37"
                                            />
                                            <rect
                                              fill="#9EA3A6"
                                              height="77.351"
                                              width="14.667"
                                              x="106.667"
                                              y="273.592"
                                            />
                                            <g>
                                              <path
                                                d="M116.667,348.277c0,12.15,9.85,22,22,22H157c12.15,0,22-9.85,22-22v-76c0-12.15-9.85-22-22-22h-18.333    c-12.15,0-22,9.85-22,22V348.277z"
                                                fill="#CECECE"
                                              />
                                            </g>
                                            <g>
                                              <rect
                                                fill="#ED1C24"
                                                height="120"
                                                width="17.667"
                                                x="116.667"
                                                y="250.277"
                                              />
                                            </g>
                                            <g>
                                              <rect
                                                fill="#202C3C"
                                                height="120"
                                                width="17.667"
                                                x="136.667"
                                                y="250.277"
                                              />
                                              <rect
                                                fill="none"
                                                height="120"
                                                stroke="#231F20"
                                                strokeMiterlimit="10"
                                                width="17.667"
                                                x="136.667"
                                                y="250.277"
                                              />
                                            </g>
                                            <rect
                                              fill="#9EA3A6"
                                              height="77.351"
                                              width="14.667"
                                              x="394.333"
                                              y="273.592"
                                            />
                                            <g>
                                              <path
                                                d="M336.667,348.277c0,12.15,9.85,22,22,22H377c12.15,0,22-9.85,22-22v-76c0-12.15-9.85-22-22-22h-18.333    c-12.15,0-22,9.85-22,22V348.277z"
                                                fill="#CECECE"
                                              />
                                            </g>
                                            <g>
                                              <rect
                                                fill="#ED1C24"
                                                height="120"
                                                width="17.667"
                                                x="381.333"
                                                y="250.277"
                                              />
                                            </g>
                                            <g>
                                              <rect
                                                fill="#202C3C"
                                                height="120"
                                                width="17.667"
                                                x="361.333"
                                                y="250.277"
                                              />
                                              <rect
                                                fill="none"
                                                height="120"
                                                stroke="#231F20"
                                                strokeMiterlimit="10"
                                                width="17.667"
                                                x="361.333"
                                                y="250.277"
                                              />
                                            </g>
                                          </g>
                                        </svg>
                                        <span className="mt-2 text-xs font-mono font-thin tracking-tighter leading-normal">
                                          {fileName}
                                        </span>
                                      </>
                                    )}
                                    {fileType.startsWith("video/") && (
                                      <>
                                        <svg
                                          height="50px"
                                          version="1.1"
                                          viewBox="0 0 512 512"
                                          width="50px"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g id="_x31_2-vlc_x2C__media_x2C__player">
                                            <g>
                                              <g>
                                                <g>
                                                  <path
                                                    d="M478.104,458.638l-59.65-119.619c-2.535-5.058-7.691-8.255-13.326-8.255H106.872      c-5.635,0-10.791,3.197-13.326,8.255L33.887,458.638c-2.325,4.637-2.053,10.141,0.66,14.538      c2.715,4.396,7.516,7.118,12.676,7.118h417.554c5.16,0,9.959-2.694,12.707-7.087      C480.193,468.778,480.404,463.307,478.104,458.638L478.104,458.638z M478.104,458.638"
                                                    style={{ fill: "#FF9800" }}
                                                  />
                                                </g>
                                                <path
                                                  d="M375.297,345.718c0,43.659-107.068,44.858-119.297,44.858c-12.23,0-119.302-1.199-119.302-44.858     c0-1.197,0.301-2.691,0.6-3.887l20.579-75.665c14.61,11.369,53.086,19.739,98.124,19.739s83.512-8.37,98.123-19.739     l20.578,75.665C375.002,343.026,375.297,344.521,375.297,345.718L375.297,345.718z M375.297,345.718"
                                                  style={{ fill: "#FCFCFC" }}
                                                />
                                                <path
                                                  d="M332.35,186.62c-18.787,5.975-46.227,9.565-76.35,9.565s-57.563-3.591-76.351-9.565l22.964-84.34     c15.506,2.69,34,4.187,53.387,4.187s37.879-1.496,53.387-4.187L332.35,186.62z M332.35,186.62"
                                                  style={{ fill: "#FCFCFC" }}
                                                />
                                                <path
                                                  d="M256,106.467c-19.387,0-37.881-1.496-53.387-4.187l10.439-37.982     c5.666-20.03,22.668-32.592,42.947-32.592s37.279,12.562,42.945,32.297l10.441,38.277     C293.879,104.971,275.387,106.467,256,106.467L256,106.467z M256,106.467"
                                                  style={{ fill: "#FF9800" }}
                                                />
                                                <path
                                                  d="M354.123,266.166c-14.611,11.369-53.086,19.739-98.123,19.739s-83.513-8.37-98.124-19.739     l21.772-79.546c18.789,5.975,46.228,9.565,76.351,9.565s57.563-3.591,76.35-9.565L354.123,266.166z M354.123,266.166"
                                                  style={{ fill: "#FF9800" }}
                                                />
                                              </g>
                                            </g>
                                          </g>
                                          <g id="Layer_1" />
                                        </svg>
                                        <span className="mt-2 text-xs font-mono font-thin tracking-tighter leading-normal">
                                          {fileName}
                                        </span>
                                      </>
                                    )}
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </CardBody>
              </Card>
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
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const addOptionSection = () => {
    if (optionsSelected.length < 10) {
      const nextOption = optionListe.find((item) => {
        return !optionsSelected.some((selected) => selected.id === item.id);
      });

      if (nextOption) {
        setOptionsSelected([...optionsSelected, { ...nextOption }]);
      }
    }
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

  const [titre, setTitre] = useState("");
  const [objectif, setObjectif] = useState("");
  const [description, setDescription] = useState("");
  const [payement, setPayement] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const createBibleStudyDto = {
      titre,
      objectif,
      description,
      payement,
    };

    const response = await createBibleStudyApi(createBibleStudyDto);

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
      // setOpenAlert(true);
      // setAlertTitle("Création réussi");
      // setAlertMsg("La création de l'annonce a réussi.");
      const Erreur: string[] = [];

      optionsSelected.forEach(async (option) => {
        const formData = new FormData();

        if (option.imageUrl instanceof File) {
          formData.append(`image`, option.imageUrl);
        }
        if (option.contentUrl instanceof File) {
          formData.append(`content`, option.contentUrl);
        }
        if (sectionTitle[option.id]) {
          formData.append(`titre`, sectionTitle[option.id]);
        }

        const res = await createContentBibleStudyApi(
          createBibleStudyDto,
          response.id,
        );

        if (res.hasOwnProperty("statusCode") && res.hasOwnProperty("message")) {
          if (typeof res.message === "object") {
            let message = "";

            res.message.map((item: string) => (message += `${item} \n`));

            Erreur.push(message);
          } else {
            Erreur.push(res.message);
          }
        }
      });

      if (Erreur.length > 0) {
        setOpenAlert(true);
        let message = "";

        Erreur.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
        setAlertTitle("Une erreur s'est produite");
      } else {
      }
    }
  };

  return (
    <>
      <div className="flex justify-center h-full">
        <form className="w-2/4" onSubmit={handleSubmit}>
          <div>
            <Input
              className="mt-4 mb-4"
              name="titre"
              placeholder="Entrer le titre principale"
              type="text"
              value={titre}
              variant="bordered"
              onChange={(e) => setTitre(e.target.value)}
            />
            <Input
              className="mt-4 mb-4"
              name="objectif"
              placeholder="Entrer l'objectif"
              type="text"
              value={objectif}
              variant="bordered"
              onChange={(e) => setObjectif(e.target.value)}
            />
            <div className="w-full mt-4 mb-4">
              <Textarea
                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                labelPlacement="outside"
                placeholder="Entrer la description"
                value={description}
                variant="bordered"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mt-4 mb-4">
              <Switch
                checked={payement}
                classNames={{
                  base: cn(
                    " inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                    "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary",
                  ),
                  wrapper: "p-0 h-4 overflow-visible",
                  thumb: cn(
                    "w-6 h-6 border-2 shadow-lg",
                    "group-data-[hover=true]:border-primary",
                    "group-data-[selected=true]:ml-6",
                    "group-data-[pressed=true]:w-7",
                    "group-data-[selected]:group-data-[pressed]:ml-4",
                  ),
                }}
                name="payement"
                onChange={(e) => setPayement(e.target.checked)}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-medium">Payement</p>
                  <p className="text-tiny text-default-400">
                    Si votre etude biblique est payant ou gratuite !
                  </p>
                </div>
              </Switch>
            </div>
          </div>

          {optionsSelected.map((item) => (
            <React.Fragment key={item.id}>
              {createSectionContent(item)}
            </React.Fragment>
          ))}

          <div className="mt-4 mb-4">
            <span className="flex items-center">
              <span className="h-px flex-1 bg-slate-600" />
            </span>
          </div>

          <div className="flex justify-between">
            <Button type="submit">Envoyer</Button>
            <Button onClick={addOptionSection}>Ajouter section</Button>
          </div>
        </form>
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
    </>
  );
}
