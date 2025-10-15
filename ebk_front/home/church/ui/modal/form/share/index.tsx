import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Input } from "@heroui/input";
import { useState } from "react";
import { CiShare2 } from "react-icons/ci";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { Button } from "@heroui/button";

import { front_url } from "@/app/lib/request/request";
import { TypeContentEnum } from "@/app/lib/config/enum";

export const ShareFormModal = ({
  file,
  session,
  typeContent,
}: {
  file: any;
  session: Session | null;
  typeContent: TypeContentEnum;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [copy, setCopy] = useState<boolean>(false);

  const link = `${front_url}share?s_share_code=${file.sharecode}&u_user=${session?.user?.username ? session?.user?.username : "any_user"}&t_type_file=${typeContent}`;

  const handleCopy = async () => {
    if (file.sharecode) {
      await navigator.clipboard.writeText(link);
      setCopy(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <CiShare2
          className="cursor-pointer"
          color={"primary"}
          size={30}
          onClick={() => {
            setOpenModal(true);
          }}
        />
        <p className="text-xs">{file?.share?.length}</p>
      </div>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Partager le contenu
              </ModalHeader>
              <ModalBody>
                <Input
                  isReadOnly
                  defaultValue={link}
                  endContent={
                    <Button size="sm" variant="light" onPress={handleCopy}>
                      <ClipboardIcon
                        className="w-6"
                        color={copy ? "red" : "primary"}
                      />
                    </Button>
                  }
                  variant="bordered"
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
