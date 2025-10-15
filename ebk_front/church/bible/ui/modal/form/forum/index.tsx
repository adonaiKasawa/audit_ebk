"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import Alert from "../../alert";

import {
  createSubjectForFourmApi,
  updateSubjectForFourmApi,
  updatetFourmApi,
} from "@/app/lib/actions/church/church";
import { subjectForum } from "@/app/lib/config/interface";

export default function AddForumSubjetFormModal({
  idForum,
  refetch,
  isOpen,
  onClose,
}: {
  idForum: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  refetch: () => void;
}) {
  const [sujet, setSuject] = useState<string>("");
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (sujet) {
      setLoading(true);
      const create = await createSubjectForFourmApi(
        { title: sujet, description },
        idForum,
      );

      setLoading(false);

      if (create) {
        refetch();
        setDescription("");
        setSuject("");
        onClose();
      } else {
        setAlertMsg("Une erreur se produite lors de la création du sujet.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le sujet est obligatoire");
      setOpenAlert(true);
    }
  };

  return (
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Ajouter un sujet
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <Input
                  required
                  placeholder="Titre"
                  type="text"
                  value={sujet}
                  onChange={(e) => {
                    setSuject(e.target.value);
                  }}
                />
                <textarea
                  className="bg-default-100 rounded-lg p-2 mt-4 w-full"
                  placeholder="Déscription"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <Button
                  className="bg-primary text-white mt-4"
                  isLoading={loading}
                  type="submit"
                >
                  Ajouter
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={"Erreur"}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </Modal>
  );
}

export function UpdateForumSubjectFormModal({
  refresh,
  subject,
  setSubject,
  isOpen,
  onClose,
}: {
  subject: subjectForum;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setSubject: Dispatch<SetStateAction<subjectForum | undefined>>;
  refresh: (select?: boolean) => Promise<void>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(true);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (subject.title) {
      setLoading(true);
      const create = await updateSubjectForFourmApi(
        { title: subject.title, description: subject.description },
        subject.id,
      );

      setLoading(false);
      if (create) {
        refresh(false);
        onClose();
      } else {
        setAlertMsg("Une erreur se produite lors de la création du sujet.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le sujet est obligatoire");
      setOpenAlert(true);
    }
  };

  const handleChange = (type: string, value: string) => {
    type === "title"
      ? setSubject({ ...subject, title: value })
      : setSubject({ ...subject, description: value });
  };

  return (
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modifier un sujet
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <Input
                  required
                  placeholder="Titre"
                  type="text"
                  value={subject.title}
                  onChange={(e) => {
                    handleChange("title", e.target.value);
                  }}
                />
                <textarea
                  className="bg-default-100 rounded-lg p-2 mt-4 w-full"
                  placeholder="Déscription"
                  rows={4}
                  value={subject.description}
                  onChange={(e) => {
                    handleChange("description", e.target.value);
                  }}
                />
                <Button
                  className="bg-primary text-white mt-4"
                  isLoading={loading}
                  type="submit"
                >
                  Ajouter
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={"Erreur"}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </Modal>
  );
}

export function UpdateForumFormModal({
  forum,
  refetch,
  isOpen,
  onClose,
}: {
  forum: any;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  refetch: () => void;
}) {
  const [sujet, setSuject] = useState<string>(forum.title);
  const [description, setDescription] = useState<string | undefined>(
    forum.description,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(true);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (sujet) {
      setLoading(true);
      const create = await updatetFourmApi(
        { title: sujet, description },
        forum.id,
      );

      setLoading(false);
      if (create) {
        refetch();
        // setDescription("");
        // setSuject("");
        onClose();
      } else {
        setAlertMsg("Une erreur se produite lors de la modification du forum.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le sujet est obligatoire");
      setOpenAlert(true);
    }
  };

  return (
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modifier un forum
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <Input
                  required
                  placeholder="Titre"
                  type="text"
                  value={sujet}
                  onChange={(e) => {
                    setSuject(e.target.value);
                  }}
                />
                <textarea
                  className="bg-default-100 rounded-lg p-2 mt-4 w-full"
                  placeholder="Déscription"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <Button
                  className="bg-primary text-white mt-4"
                  isLoading={loading}
                  type="submit"
                >
                  Modifier
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={"Erreur"}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </Modal>
  );
}
