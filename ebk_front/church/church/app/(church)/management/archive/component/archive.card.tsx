"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CiFolderOn } from "react-icons/ci";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";

import ArchiveOptionActionComponent from "./archive.option.action";

import CreateFolderArchiveFormModal from "@/ui/modal/form/archive";
import BtnSwitchArchive from "@/ui/btn/switch.archive";
import { getFileIcon } from "@/app/lib/config/func";
import { file_url } from "@/app/lib/request/request";
import { SearchIcon } from "@/ui/icons";

export type ArchiveProps = {
  handelFindArchiveByEgliseId: () => Promise<void>;
  initData: any;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  setOnUploadDocument: React.Dispatch<React.SetStateAction<boolean>>;
  onUploadDocument: boolean;
  id?: number;
  created: boolean;
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
  documentsUrl: FileList | null;
  setDocumentsUrl: (FileList: FileList) => void;
};

export default function ArchiveCardComponent({
  documentsUrl,
  setDocumentsUrl,
  created,
  setCreated,
  onUploadDocument,
  setOnUploadDocument,
  handelFindArchiveByEgliseId,
  initData,
  state,
  setState,
  id,
}: ArchiveProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Recherche par nom..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          // value={filterValue}
          variant="bordered"
          // onClear={() => setFilterValue("")}
          // onValueChange={onSearchChange}
        />
        <div className="flex items-center gap-3">
          <BtnSwitchArchive setState={setState} state={state} />
          <CreateFolderArchiveFormModal
            created={created}
            documentsUrl={documentsUrl}
            handelFindArchiveByEgliseId={handelFindArchiveByEgliseId}
            id={id}
            setCreated={setCreated}
            setDocumentsUrl={setDocumentsUrl}
            setOnUploadDocument={setOnUploadDocument}
            onUploadDocument={onUploadDocument}
          />
        </div>
      </div>

      <p className="text-default-500 mt-4">Dossiers</p>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {initData.subFolder.map((item: any) => {
          return (
            <Card key={item.uuidName} shadow="lg">
              <CardBody
                onDoubleClick={() => {
                  router.push(`/church/management/archive/${item.uuidName}`);
                }}
              >
                <div className="grid grid-cols-5 items-center gap-4">
                  {item.hasOwnProperty("typeMime") ? (
                    getFileIcon(item.name, 35)
                  ) : (
                    <CiFolderOn size={35} />
                  )}
                  <div className="col-span-4 flex  w-full items-center justify-between">
                    <p className="line-clamp-1">{item.name}</p>
                    <ArchiveOptionActionComponent
                      handelFindArchiveByEgliseId={handelFindArchiveByEgliseId}
                      id={item.id}
                      name={item.name}
                      type="Folder"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <p className="text-default-500 mt-4">Fichiers</p>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {initData.archiveDocuments.map((item: any) => {
          return (
            <Card key={item.uuidName} shadow="lg">
              <CardBody
                onDoubleClick={() => {
                  router.push(`${file_url}${item.path}`);
                }}
              >
                <div className="grid grid-cols-5 items-center gap-4">
                  {item.hasOwnProperty("typeMime") ? (
                    getFileIcon(item.name, 35)
                  ) : (
                    <CiFolderOn size={35} />
                  )}
                  <div className="col-span-4 flex  w-full items-center justify-between">
                    <p className="line-clamp-1">{item.name}</p>
                    <ArchiveOptionActionComponent
                      handelFindArchiveByEgliseId={handelFindArchiveByEgliseId}
                      id={item.id}
                      name={item.name}
                      type="Document"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
