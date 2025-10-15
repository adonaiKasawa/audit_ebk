import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { otherInterface } from "@/app/lib/config/interface";

export default function TagModal({
  setTag,
  other,
  color,
  setOpen,
  open,
  verset,
}: {
  setTag: any;
  other: otherInterface;
  color: string;
  open: boolean;
  setOpen: any;
  verset: string;
}) {
  const { book, chapter, version, description } = other;
  const [title, setTitle] = useState<string>("");

  const handleSubmit = async () => {
    setTag({
      title,
      description,
      version,
      book,
      chapter,
      verse: verset,
      colorTag: color,
    });
    setOpen(false);
  };

  return (
    <>
      <Modal
        backdrop="transparent"
        isOpen={open}
        size="sm"
        onClose={() => setOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Titre du tag
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Titre du tag"
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setOpen(false)}
            >
              Reduire
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              Confimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
