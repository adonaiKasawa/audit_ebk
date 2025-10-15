"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { VscNewFolder } from "react-icons/vsc";
import { FaFileArrowUp } from "react-icons/fa6";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";

import Alert from "../../alert";

import { createArchiveFolderApi } from "@/app/lib/actions/management/archive/mange.archive.req";

type CreatArchiveProps = {
  documentsUrl: FileList | null;
  setDocumentsUrl: (FileList: FileList) => void;
  created: boolean;
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
  handelFindArchiveByEgliseId: () => Promise<void>;
  setOnUploadDocument: React.Dispatch<React.SetStateAction<boolean>>;
  onUploadDocument: boolean;
  id?: number;
};

export default function CreateFolderArchiveFormModal({
  setDocumentsUrl,
  setOnUploadDocument,
  handelFindArchiveByEgliseId,
  id,
}: CreatArchiveProps) {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [folder, setFolder] = useState<string>("Dossier sans titre");

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  // const [croppedImageUrl, setCroppedImageUrl] = useState<FileList | null>(null);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handlAction = async () => {
    setPending(true);
    const create = await createArchiveFolderApi({
      name: folder,
      parentId: id ? id : undefined,
    });

    setPending(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
    ) {
      handelFindArchiveByEgliseId();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof create.message === "object") {
        let message = "";

        create.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    }
  };

  const handleOnChange = async (event: React.ChangeEvent) => {
    const { files } = event.target as HTMLInputElement;

    if (files && files.length !== 0) {
      if (files.length > 20) {
        setOpenAlert(true);
      } else {
        setDocumentsUrl(files);
        setOnUploadDocument(true);
      }
    }
  };

  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content:
            "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
        closeOnSelect={false}
      >
        <DropdownTrigger>
          <Button fullWidth className="text-2xl " size="lg" variant="flat">
            <AiOutlinePlus /> Nouveau
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dropdown menu with description"
          variant="faded"
        >
          <DropdownSection title="Actions">
            <DropdownItem
              key="new"
              description="Créer un nouveau dossier"
              shortcut="⌘N"
              startContent={<VscNewFolder className={iconClasses} />}
              onClick={onOpen}
            >
              Nouveau dossier
            </DropdownItem>

            <DropdownItem
              key="edit"
              description="Importer un nouveau fichier"
              shortcut="⌘⇧E"
              startContent={<FaFileArrowUp className={iconClasses} />}
            >
              <input
                multiple
                className="hidden"
                id="upload"
                type="file"
                onChange={handleOnChange}
              />
              <label className="cursor-pointer" htmlFor="upload">
                Importer un fichier
              </label>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Créer un dossier
              </ModalHeader>
              <ModalBody>
                <Input
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={folder === ""}
                  label="Nouveau dossier"
                  placeholder="Nouveau dossier"
                  size="lg"
                  value={folder}
                  variant="bordered"
                  onChange={(e) => {
                    setFolder(e.target.value);
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  className="text-white"
                  color="primary"
                  isDisabled={folder === ""}
                  isLoading={pending}
                  onPress={handlAction}
                >
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Alert
        alertBody={<p className="text-center">{alertMsg}</p>}
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
