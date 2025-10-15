"use client";
import React, { useEffect, useState } from "react";
import { MdForum } from "react-icons/md";
import { CiEdit, CiTrash } from "react-icons/ci";
import Link from "next/link";
import { Session } from "next-auth";
import { Button } from "@heroui/button";

import { PrivilegesEnum, TypeContentEnum } from "@/app/lib/config/enum";
import {
  deleteSubjectFourmApi,
  deleteFourmApi,
  findCommentByForumApi,
  findForumByIdApi,
} from "@/app/lib/actions/church/church";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

import DialogAction from "@/ui/modal/dialog";
import { CommentUI } from "@/ui/comment/comment.item";
import { FavoriSignaleUI } from "@/ui/favoriSignale/favoris.signale";
import { ListBoxSubjectForum } from "@/ui/lisbox";
import AddForumSubjetFormModal, {
  UpdateForumSubjectFormModal,
  UpdateForumFormModal,
} from "@/ui/modal/form/forum";

import {
  CommentairesPaginated,
  subjectForum,
} from "@/app/lib/config/interface";

export default function ForumDetail({
  params,
  session,
  iniData,
}: {
  params: { id: string };
  session: Session | null;
  iniData: { forum: any; comments: any };
}) {
  const { id } = params;
  const { forum } = iniData;
  

  const [subjectForumSelected, setSubjectForumselected] = useState<
    subjectForum | undefined
  >(iniData.forum.subjectForum[0]);

  const [commentBySubjectForum, setCommentBySubjectForum] = useState<CommentairesPaginated | undefined>(undefined)

  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenUpdateForum, setIsOpenUpdateForum] = useState<boolean>(false);
  const [openDialogAction, setOpenDialogoAction] = useState<boolean>(false);
  const [isOpenUpdateForumSb, setIsOpenUpdateForumSb] =
    useState<boolean>(false);
  const [openDialogActionSb, setOpenDialogoActionSb] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFindCommentBySubjectForum = async (id_sf: number) => {
    setLoadingComment(true);
    const find = await findCommentByForumApi(id_sf);
    setLoadingComment(false);
    if (find) setCommentBySubjectForum(find);
  };

  const handleFindForumById = async (select: boolean = true) => {
    const find = await findForumByIdApi(forum.id);
    if (find) {
      if (select) {
        if (find.subjectForum.length > 0) {
          handleChangeSubjectForum(find.subjectForum[0]);
        } else {
          handleFindCommentBySubjectForum(find.id);
        }
      }
    }
  };

  const handleChangeSubjectForum = (subjet: any) => {
    setSubjectForumselected(subjet);
    handleFindCommentBySubjectForum(subjet.id);
  };

  const handleDeleteForum = async (type: string = "forum") => {
    if (type === "forum") {
      const deleteForum = await deleteFourmApi(forum.id);
      if (deleteForum) {
        document.location = "/church/forum";
      } else {
        alert("Une erreur est survenue lors de la suppresion du forum");
      }
    } else if (type === "subject") {
      if (subjectForumSelected) {
        const id = subjectForumSelected.id;
        const deleteForum = await deleteSubjectFourmApi(id);
        if (deleteForum) {
          handleFindForumById();
        } else {
          alert("Une erreur est survenue lors de la suppresion du forum");
        }
      } else {
        alert("Le sujet n'est pas sélectionné");
      }
    }
  };

  useEffect(() => {
  if (iniData.comments) {
    setCommentBySubjectForum(iniData.comments);
  }
}, [iniData.comments]);

  return (
    <div>
      {forum ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <Link href="/church/forum">
                <MdForum className="text-foreground" size={40} />
              </Link>
              <div>
                <h1 className="text-5xl">{forum?.title}</h1>
              </div>
            </div>

            {session?.user &&
            session.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE &&
            forum.eglise.id_eglise === session.user.eglise.id_eglise ? (
              <div className="flex gap-4">
                <Button
                  isIconOnly
                  color="success"
                  variant="bordered"
                  onClick={() => setIsOpenUpdateForum(true)}
                >
                  <CiEdit size={24} />
                </Button>
                <Button
                  isIconOnly
                  color="danger"
                  variant="bordered"
                  onClick={() => setOpenDialogoAction(true)}
                >
                  <CiTrash size={24} />
                </Button>
                <Button onClick={() => setOpen(true)}>Créer un sujet</Button>
              </div>
            ) : (
              <FavoriSignaleUI
                contentId={forum.id}
                initFavoris={forum.favoris}
                session={forum}
                typeContent={TypeContentEnum.forum}
              />
            )}
          </div>

          <div className="grid grid-cols-6 gap-4 mt-4">
            {subjectForumSelected ? (
              <>
                <div className="col-span-6 relative min-h-[80vh]">
                  <div className="flex justify-between items-center w-full mb-4">
                    {session &&
                      session.user.privilege_user ===
                        PrivilegesEnum.ADMIN_EGLISE &&
                      forum.eglise.id_eglise ===
                        session.user.eglise.id_eglise && (
                        <div className="flex gap-4">
                          <Button
                            isIconOnly
                            color="success"
                            size="sm"
                            variant="bordered"
                            onClick={() => setIsOpenUpdateForumSb(true)}
                          >
                            <CiEdit size={24} />
                          </Button>
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            variant="bordered"
                            onClick={() => setOpenDialogoActionSb(true)}
                          >
                            <CiTrash size={24} />
                          </Button>
                        </div>
                      )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-background px-6 py-4">
                    <CommentUI
                      comments={forum.commentaires}
                      idEglise={forum.eglise.id_eglise}
                      idFile={forum.id}
                      inForum={true}
                      loadingComment={loadingComment}
                      resetInitComment={setCommentBySubjectForum}
                      session={session}
                      typeFile={TypeContentEnum.forum}
                    />
                  </div>
                </div>

                <UpdateForumSubjectFormModal
                  isOpen={isOpenUpdateForumSb}
                  refresh={handleFindForumById}
                  setSubject={setSubjectForumselected}
                  subject={subjectForumSelected}
                  onClose={() => setIsOpenUpdateForumSb(false)}
                  onOpen={() => setIsOpenUpdateForumSb(true)}
                />
              </>
            ) : (
              <div className="col-span-12 h-screen flex justify-center items-center">
                <h1 className="text-3xl font-semibold text-gray-400">
                  Le forum n&#39;a aucun sujet créé.
                </h1>
              </div>
            )}
          </div>

          <AddForumSubjetFormModal
            idForum={forum.id}
            isOpen={isOpen}
            refetch={handleFindForumById}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
          />

          <UpdateForumFormModal
            forum={forum}
            isOpen={isOpenUpdateForum}
            refetch={handleFindForumById}
            onClose={() => setIsOpenUpdateForum(false)}
            onOpen={() => setIsOpenUpdateForum(true)}
          />

          <DialogAction
            action={handleDeleteForum}
            dialogBody={<p>Êtes-vous sûr de vouloir supprimer le forum ?</p>}
            dialogTitle={"Suppression du forum"}
            isOpen={openDialogAction}
            onClose={() => setOpenDialogoAction(false)}
            onOpen={() => setOpenDialogoAction(true)}
          />

          <DialogAction
            action={async () => {
              handleDeleteForum("subject");
            }}
            dialogBody={<p>Êtes-vous sûr de vouloir supprimer le sujet ?</p>}
            dialogTitle={"Suppression du sujet"}
            isOpen={openDialogActionSb}
            onClose={() => setOpenDialogoActionSb(false)}
            onOpen={() => setOpenDialogoActionSb(true)}
          />
        </>
      ) : null}
    </div>
  );
}
