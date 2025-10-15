import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Input } from "@heroui/input";
import { useState } from "react";
import { CiShare2 } from "react-icons/ci";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { Button } from "@heroui/button";

import { front_url } from "@/app/lib/request/request";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook, FaXTwitter,} from "react-icons/fa6";
import Link from "next/link";

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
  const publicShareLink = `${front_url}${typeContent}/${file.id}`;


  const encodedLink = encodeURIComponent(publicShareLink);
  const whatsappShareUrl = `https://wa.me/?text=${encodedLink}`; 
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}`;




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
                <div className="flex gap-4 justify-center py-4">
                <Link href={whatsappShareUrl} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp size={30} color="#25D366" />
                </Link>
                <Link href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={30} color="#1877F2" />
                </Link>
                 <Link href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                    <FaXTwitter size={30} color="#000" />
                  </Link>
              </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
