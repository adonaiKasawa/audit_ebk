import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import clsx from "clsx";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { file_url } from "@/app/lib/request/request";

export default function GaleryModale({
  children,
  pictures,
}: {
  children: React.ReactNode;
  pictures: string[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pictureSelected, setPictureSelected] = useState<number>(0);

  return (
    <>
      <button onClick={onOpen}>{children}</button>
      <Modal
        backdrop="blur"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          wrapper: "h-2/4",
        }}
        isOpen={isOpen}
        scrollBehavior="outside"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {pictures.length}
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-4">
                  <div className="w-full flex justify-center">
                    <Image
                      alt=""
                      className="object-contain rounded-lg"
                      src={`${file_url}${pictures[pictureSelected]}`}
                      style={{ height: 500 }}
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    {pictures.map((item, i) => (
                      <div key={i}>
                        <Image
                          isZoomed
                          alt={`${pictureSelected}`}
                          className={clsx(
                            "object-cover rounded-lg cursor-pointer ",
                            {
                              "object-cover rounded-lg border-2 border-danger":
                                i === pictureSelected,
                            },
                          )}
                          height={100}
                          src={`${file_url}${item}`}
                          style={{ height: 100 }}
                          width={100}
                          onClick={() => {
                            setPictureSelected(i);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function ImageGaleryItem({
  picture,
  index,
  focusIndex,
  setFocus,
  deletePicture,
}: {
  picture: string;
  index: number;
  focusIndex: number;
  setFocus: React.Dispatch<React.SetStateAction<number>>;
  deletePicture: (index: number) => void;
}) {
  return (
    <div className="relative">
      <Image
        isZoomed
        alt=""
        className={clsx("object-cover rounded-lg cursor-pointer ", {
          "object-cover rounded-lg border-2 border-danger":
            index === focusIndex,
        })}
        height={100}
        src={`${file_url}${picture}`}
        style={{ height: 100 }}
        width={100}
        onClick={() => {
          setFocus(index);
        }}
      />
      {index === focusIndex && (
        <Button
          isIconOnly
          className="absolute top-1 right-1 bg-danger z-10"
          radius="full"
          size="sm"
          onClick={() => {
            deletePicture(index);
          }}
        >
          <AiOutlineClose />
        </Button>
      )}
    </div>
  );
}
