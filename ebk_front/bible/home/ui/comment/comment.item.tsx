"use client";

import React from "react";
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { HiDotsHorizontal } from "react-icons/hi";
import moment from "moment";
import "moment/locale/fr";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Dispatch, SetStateAction, useState } from "react";
import { Session } from "next-auth";
// import { useDisclosure } from "@heroui/modal";
import { Textarea } from "@heroui/input";
import Link from "next/link";

import { CommentItemSkeleton } from "../skeleton/card.video.file.skleton";

import { CommentFileApi } from "@/app/lib/actions/library/library";
import {
  Commentaires,
  CommentairesPaginated,
} from "@/app/lib/config/interface";
import { PrivilegesEnum, TypeContentEnum } from "@/app/lib/config/enum";
import { file_url } from "@/app/lib/request/request";

export function CommentItem({
  idEglise,
  comment,
  session,
}: {
  idEglise: number;
  comment: Commentaires;
  session: Session | null;
}) {
  return (
    <div className="comment-item-layout">
      <div className="comment-item-header w-full">
        <Avatar
          className="rounded-md"
          size="sm"
          src={`${comment?.users.profil !== null ? file_url + comment.users.profil : "https://i.pravatar.cc/150?u=a042581f4e29026704d"}`}
        />
        <div className="flex justify-between w-full">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={
                  session?.user.sub == comment.users.id
                    ? `/account`
                    : `/f/${comment?.users?.username}`
                }
              >
                <p className="">
                  {comment.users.nom} {comment.users.prenom}
                </p>
                {session?.user.sub == comment.users.id && (
                  <p className="text-xs text-gray-500">{`(vous)`}</p>
                )}
              </Link>
            </div>

            <p className="text-xs text-gray-500">
              {moment(comment.createdAt).fromNow()}
            </p>
          </div>
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="bordered">
                  <HiDotsHorizontal className="cursor-pointer" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="liked">Like</DropdownItem>
                <DropdownItem key="response">Répondre</DropdownItem>
                {(session?.user.privilege_user ===
                  PrivilegesEnum.ADMIN_EGLISE &&
                  session?.user.eglise.id_eglise === idEglise) ||
                comment.users.id === session?.user.sub ? (
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    Supprimer
                  </DropdownItem>
                ) : (
                  <DropdownItem key="response">Singaler</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="comment-item-frame-content">
        <p className="comment-item-text">{comment.commentaire}</p>
      </div>
    </div>
  );
}

export function CommentInput({
  text,
  onChangeText,
  loading,
  session,
}: {
  text: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  loading: boolean;
  session: Session | null;
}) {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex justify-center items-center">
      <Avatar
        isBordered
        className="w-12 h-10 rounded-full text-tiny mr-2 ml-2"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
      <Textarea
        className="ml-2 mr-2"
        placeholder="Votre commentaire"
        value={text}
        variant="bordered"
        onChange={(e) => {
          onChangeText(e.target.value);
        }}
      />
      {session ? (
        <>
          {loading ? (
            <Spinner color="danger" />
          ) : (
            <Button
              isIconOnly
              className="ml-2 mr-2"
              type="submit"
              variant="bordered"
            >
              <PaperAirplaneIcon className="w-6" />
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            as={Link}
            color="danger"
            href="/api/auth/signin"
            variant="bordered"
          >
            <UserIcon className="w-6" />
            Se connecter
          </Button>
        </>
      )}
    </div>
  );
}

export function CommentUI({
  idEglise,
  idFile,
  comments,
  setComments,
  resetInitComment,
  inForum,
  typeFile,
  loadingComment,
  session,
}: {
  idEglise: number;
  idFile: number;
  inForum?: boolean;
  comments: Commentaires[] | undefined;
  setComments: (comments: Commentaires[]) => void;
  resetInitComment?: React.Dispatch<
    React.SetStateAction<CommentairesPaginated | undefined>
  >;
  typeFile: TypeContentEnum;
  loadingComment: boolean;
  session: Session | null;
}) {
  const [text, onChangeText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCommentFile = async () => {
    setLoading(true);

    const commentFile = await CommentFileApi(idFile, typeFile, text);

    onChangeText("");
    setLoading(false);

    if (commentFile) {
      if (inForum) {
        if (resetInitComment && comments) {
          resetInitComment({
            items: [...comments, commentFile],
            meta: {
              totalItems: comments.length + 1,
              itemCount: comments.length + 1,
              itemsPerPage: 10000,
              totalPages: 1,
              currentPage: 1,
            },
            links: {
              first: "https://ecclesiabook.org/api_test/comment/findByContentId/paginated/1/sujetForum?limit=10000",
              previous: "",
              next: "",
              last: "https://ecclesiabook.org/api_test/comment/findByContentId/paginated/1/sujetForum?page=1&limit=10000",
            },
          });
        }
      } else {
        if (comments) {
          setComments([...comments, commentFile]);
        } else {
          setComments([commentFile]);
        }
      }
    } else {
      alert("Une erreur est survenue lors du traitement de votre commentaire!");
    }
  };

  return (
    <div className="w-full mt-4">
      <ScrollShadow
        hideScrollBar
        className="h-[300px] gap-3"
        style={{ maxHeight: 300, paddingBottom: 100 }}
      >
        {!loadingComment ? (
          comments?.map((item, i) => (
            <CommentItem
              key={i}
              comment={item}
              idEglise={idEglise}
              session={session}
            />
          ))
        ) : (
          <>
            <CommentItemSkeleton />
            <CommentItemSkeleton />
          </>
        )}
      </ScrollShadow>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleCommentFile();
        }}
      >
        <CommentInput
          loading={loading}
          session={session}
          text={text}
          onChangeText={onChangeText}
        />
      </form>
    </div>
  );
}
