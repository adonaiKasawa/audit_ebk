import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import {
  deleteAchiveById,
  updateAchiveById,
} from "@/app/lib/actions/management/archive/mange.archive.req";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { VerticalDotsIcon } from "@/ui/icons";

export default function ArchiveOptionActionComponent({
  id,
  type,
  name,
  handelFindArchiveByEgliseId,
}: {
  handelFindArchiveByEgliseId: () => Promise<void>;
  id: number;
  type: "Folder" | "Document";
  name: string;
}) {
  const [newNameFile, setNewNameFile] = useState<string>(name);
  const [extensionFile, setextensionFile] = useState<string>("ext");
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const getNameFile = useCallback(() => {
    const e = name.split(".").pop();

    setNewNameFile(name.split(".")[0]);
    if (e) {
      const i = e ? e : name;

      setextensionFile(i);
    }
  }, [name]);

  const handlRenameArchive = async () => {
    setPending(true);
    const update = await updateAchiveById(type, id, {
      name: `${newNameFile}.${extensionFile}`,
    });

    setPending(false);

    if (
      !update.hasOwnProperty("statusCode") &&
      (!update.hasOwnProperty("error") || !update.hasOwnProperty("error"))
    ) {
      handelFindArchiveByEgliseId();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof update.message === "object") {
        let message = "";

        update.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    }
  };

  const handlRemoveArchive = async () => {
    setPending(true);
    const remove = await deleteAchiveById(type, id);

    setPending(false);

    if (
      !remove.hasOwnProperty("statusCode") &&
      (!remove.hasOwnProperty("error") || !remove.hasOwnProperty("error"))
    ) {
      handelFindArchiveByEgliseId();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof remove.message === "object") {
        let message = "";

        remove.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(remove.message);
      }
    }
  };

  useEffect(() => {
    getNameFile();
  }, [getNameFile]);

  return (
    <>
      <Dropdown className="bg-background border-1 border-default-200">
        <DropdownTrigger>
          <Button isIconOnly radius="full" size="sm" variant="light">
            <VerticalDotsIcon className="text-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {/* <DropdownItem>Ouvrir</DropdownItem> */}
          <DropdownItem key={"rename"} onClick={onOpen}>
            Renomer
          </DropdownItem>
          <DropdownItem
            key={"delete"}
            onClick={() => {
              setIsOpenDialog(true);
            }}
          >
            Supprimer
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Renommer
              </ModalHeader>
              <ModalBody>
                <Input
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        .{extensionFile}
                      </span>
                    </div>
                  }
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={newNameFile === ""}
                  label="Nom"
                  labelPlacement="outside"
                  placeholder="Nom"
                  size="lg"
                  value={newNameFile}
                  variant="bordered"
                  onChange={(e) => {
                    setNewNameFile(e.target.value);
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
                  isDisabled={newNameFile === ""}
                  isLoading={pending}
                  onPress={handlRenameArchive}
                >
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <DialogAction
        action={handlRemoveArchive}
        dialogBody={
          <p className="text-2xl p-4 text-center">
            Êtes-vous sûr(e) de vouloir supprimer cet élément de vos archives ?
          </p>
        }
        dialogTitle={"Votre Attention SVP"}
        isOpen={isOpenDialog}
        onClose={() => {
          setIsOpenDialog(false);
        }}
        onOpen={() => {
          setIsOpenDialog(true);
        }}
      />
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
