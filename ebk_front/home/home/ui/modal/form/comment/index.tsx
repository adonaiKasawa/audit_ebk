"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { CiChat1 } from "react-icons/ci";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

import { CommentUI } from "@/ui/comment/comment.item";
import { Commentaires } from "@/app/lib/config/interface";
import { TypeContentEnum } from "@/app/lib/config/enum";

export const CommentModalUI = ({
  idEglise,
  idFile,
  comments,
  typeFile,
  loadingComment,
  session,
}: {
  idEglise: number;
  idFile: number;
  comments: Commentaires[];
  typeFile: TypeContentEnum;
  loadingComment: boolean;
  session: Session | null;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [commentsState, setCommentsState] = useState<Commentaires[]>(comments);
 
  return (
    <div>
      <div className="flex items-center">
        <CiChat1
          className="cursor-pointer"
          color={"primary"}
          size={30}
          onClick={() => {
            setOpenModal(true);
          }}
        />
        <p className="text-xs">{commentsState.length}</p>
      </div>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        size="3xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Commentaire {commentsState.length}
              </ModalHeader>
              <ModalBody>
                <CommentUI
                  comments={commentsState} // ✅ on utilise le state local
                  idEglise={idEglise}
                  idFile={idFile}
                  loadingComment={loadingComment}
                  session={session}
                  setComments={setCommentsState}
                  typeFile={typeFile}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
