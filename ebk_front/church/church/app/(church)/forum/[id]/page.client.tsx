"use client";
import React from "react";
import { useState } from "react";
import { MdForum } from "react-icons/md";
import { CiEdit, CiTrash } from "react-icons/ci";
import Link from "next/link";
import { Session } from "next-auth";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

import DialogAction from "@/ui/modal/dialog";
import AddForumSubjetFormModal, {
  UpdateForumFormModal,
  UpdateForumSubjectFormModal,
} from "@/ui/modal/form/forum";
import { CommentUI } from "@/ui/comment/comment.item";
import {
  CommentairesPaginated,
  subjectForum,
} from "@/app/lib/config/interface";
import { PrivilegesEnum, TypeContentEnum } from "@/app/lib/config/enum";
import {
  deleteFourmApi,
  deleteSubjectFourmApi,
  findCommentBySubjectForumApi,
  findForumByIdApi,
} from "@/app/lib/actions/church/church";
import { FavoriSignaleUI } from "@/ui/favoriSignale/favoris.signale";
import { ListBoxSubjectForum } from "@/ui/lisbox";

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
  const [commentBySubjectForum, setCommentBySubjectForum] =
    useState<CommentairesPaginated>();
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenUpdateForum, setIsOpenUpdateForum] = useState<boolean>(false);
  const [openDialogAction, setOpenDialogoAction] = useState<boolean>(false);

  const [isOpenUpdateForumSb, setIsOpenUpdateForumSb] =
    useState<boolean>(false);
  const [openDialogActionSb, setOpenDialogoActionSb] = useState<boolean>(false);

  const handleFindCommentBySubjectForum = async (id_sf: number) => {
    setLoadingComment(true);
    const find = await findCommentBySubjectForumApi(id_sf);

    setLoadingComment(false);
    if (find) {
      setCommentBySubjectForum(find);
    }
  };

  const handleFindForumById = async (select: boolean = true) => {
    const find = await findForumByIdApi(id);

    if (find) {
      if (select) {
        if (find.subjectForum.length > 0) {
          handleChangeSubjectForum(find.subjectForum[0]);
        } else {
          // setSubjectForumselected();
          setCommentBySubjectForum({
            items: [],
            meta: {
              totalItems: 0,
              itemCount: 0,
              itemsPerPage: 0,
              totalPages: 0,
              currentPage: 0,
            },
            links: {
              first: "",
              previous: "",
              next: "",
              last: "",
            },
          });
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
        alert("Les sujets n'est pas Sélectionner");
      }
    }
  };

  // useEffect(() => {
  //   let isMount = true;
  //   if (isMount) {
  //     handleFindForumById()
  //   }
  //   return () => {
  //     isMount = false
  //   }
  // }, []);

  return (
    <div>
      {forum ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <Link className="" href="/church/forum">
                <MdForum className="text-forground text-foreground" size={40} />
              </Link>
              <div>
                <h1 className="text-5xl">{forum?.title}</h1>
                <p>{forum?.description}</p>
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
                  onClick={() => {
                    setIsOpenUpdateForum(true);
                  }}
                >
                  <CiEdit size={24} />
                </Button>
                <Button
                  isIconOnly
                  color="danger"
                  variant="bordered"
                  onClick={() => {
                    setOpenDialogoAction(true);
                  }}
                >
                  <CiTrash size={24} />
                </Button>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Crée un sujet
                </Button>
              </div>
            ) : (
              <>
                <p>{session?.user.email}</p>
                <FavoriSignaleUI
                  contentId={forum.id}
                  initFavoris={forum.favoris}
                  session={forum}
                  typeContent={TypeContentEnum.forum}
                />
              </>
            )}
          </div>
          <Divider />
          <div className="grid grid-cols-6 gap-4 mt-4">
            {subjectForumSelected ? (
              <>
                <div className="col-span-2">
                  {subjectForumSelected && (
                    <ListBoxSubjectForum
                      setSubjectForumselected={handleChangeSubjectForum}
                      subjectForum={forum?.subjectForum}
                      subjectForumSelected={subjectForumSelected}
                    />
                  )}
                </div>
                <div className="col-span-4">
                  <Card className="max-h-screen">
                    <CardHeader className="text-2xl">
                      <div className="flex justify-between items-center w-full">
                        {subjectForumSelected.title.toUpperCase()}
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
                                onClick={() => {
                                  setIsOpenUpdateForumSb(true);
                                }}
                              >
                                <CiEdit size={24} />
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="bordered"
                                onClick={() => {
                                  setOpenDialogoActionSb(true);
                                }}
                              >
                                <CiTrash size={24} />
                              </Button>
                            </div>
                          )}
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Divider />
                      <CommentUI
                        comments={commentBySubjectForum?.items}
                        idEglise={forum.eglise.id_eglise}
                        idFile={forum.id}
                        inForum={true}
                        loadingComment={loadingComment}
                        resetInitComment={setCommentBySubjectForum}
                        session={session}
                        typeFile={TypeContentEnum.forum}
                      />
                    </CardBody>
                  </Card>
                </div>
                <UpdateForumSubjectFormModal
                  isOpen={isOpenUpdateForumSb}
                  refresh={handleFindForumById}
                  setSubject={setSubjectForumselected}
                  subject={subjectForumSelected}
                  onClose={() => {
                    setIsOpenUpdateForumSb(false);
                  }}
                  onOpen={() => {
                    setIsOpenUpdateForumSb(true);
                  }}
                />
              </>
            ) : (
              <div className="col-span-12 h-screen">
                <div className="flex justify-center items-center h-full">
                  <h1 className="text-3xl font-semibold text-gray-400">
                    Le forum n&#39;a aucun sujet crée.
                  </h1>
                </div>
              </div>
            )}
          </div>
          <AddForumSubjetFormModal
            idForum={forum.id}
            isOpen={isOpen}
            refetch={handleFindForumById}
            onClose={() => {
              setOpen(false);
            }}
            onOpen={() => {
              setOpen(true);
            }}
          />
          <UpdateForumFormModal
            forum={forum}
            isOpen={isOpenUpdateForum}
            refetch={handleFindForumById}
            onClose={() => {
              setIsOpenUpdateForum(false);
            }}
            onOpen={() => {
              setIsOpenUpdateForum(true);
            }}
          />
          <DialogAction
            action={handleDeleteForum}
            dialogBody={<p>Etes-vous sure de vouloire suppimer le forum?</p>}
            dialogTitle={"Suppresion du forum"}
            isOpen={openDialogAction}
            onClose={() => {
              setOpenDialogoAction(false);
            }}
            onOpen={() => setOpenDialogoAction(true)}
          />
          <DialogAction
            action={async () => {
              handleDeleteForum("subject");
            }}
            dialogBody={<p>Etes-vous sure de vouloire suppimer le sujet?</p>}
            dialogTitle={"Suppresion du sujet"}
            isOpen={openDialogActionSb}
            onClose={() => {
              setOpenDialogoActionSb(false);
            }}
            onOpen={() => setOpenDialogoActionSb(true)}
          />
        </>
      ) : null}
    </div>
  );
}
