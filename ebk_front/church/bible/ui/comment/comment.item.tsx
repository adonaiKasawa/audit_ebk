"use client";

import React, { useEffect } from "react";
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


function TimeAgo({ date }: { date: Date | string }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const update = () => {
      setTimeAgo(moment(date).fromNow());
    };

    update();

    const interval = setInterval(update, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [date]);

  return <span className="text-xs text-gray-500">{timeAgo}</span>;
}

export function CommentItem({
  idEglise,
  comment,
  session,
}: {
  idEglise: number;
  comment: Commentaires;
  session: Session | null;
}) {
  const isOwner = session?.user.sub === comment.users.id;
  const isAdmin =
    session?.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE &&
    session?.user.eglise.id_eglise === idEglise;

    

  return (
    <div className="flex gap-2 mb-4">
      {/* Avatar à gauche */}
      <Avatar
        className="rounded-md w-10 h-10"
        size="sm"
        src={
          comment?.users.profil !== null
            ? file_url + comment.users.profil
            : "https://i.pravatar.cc/150?u=a042581f4e29026704d"
        }
      />

      {/* Contenu du commentaire à droite */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={
                  isOwner ? `/account` : `/f/${comment?.users?.username}`
                }
                className="text-sm font-semibold text-gray-700 hover:underline"
              >
                {comment.users.nom} {comment.users.prenom}
              </Link>
              {isOwner && (
                <span className="text-xs text-gray-500 ml-1">(vous)</span>
              )}
            </div>
           <TimeAgo date={comment.createdAt} />
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="bordered" size="sm">
                <HiDotsHorizontal className="cursor-pointer" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="liked">Like</DropdownItem>
              <DropdownItem key="response">Répondre</DropdownItem>
              {(isAdmin || isOwner) ? (
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Supprimer
                </DropdownItem>
              ) : (
                <DropdownItem key="report">Signaler</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Texte du commentaire */}
        <div className="mt-2 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {comment.commentaire}
          </p>
        </div>
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
  resetInitComment?: React.Dispatch<
    React.SetStateAction<CommentairesPaginated | undefined>
  >;
  typeFile: TypeContentEnum;
  loadingComment: boolean;
  session: Session | null;
}) {
  const [initComments, setInitComments] = useState<Commentaires[]>(
    comments || [],
  );
  const [text, onChangeText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (comments) {
      setInitComments(comments); // rafraîchir si `comments` change depuis le parent
    }
  }, [comments]);

  const handleCommentFile = async () => {
    setLoading(true);

    const commentFile = await CommentFileApi(idFile, typeFile, text);
    onChangeText("");
    setLoading(false);

    if (commentFile) {
      // Mise à jour locale instantanée
      setInitComments((prev) => [...prev, commentFile]);

      // Mise à jour côté parent (backend)
      if (inForum && resetInitComment) {
        resetInitComment({
          items: [...initComments, commentFile],
          meta: {
            totalItems: initComments.length + 1,
            itemCount: initComments.length + 1,
            itemsPerPage: 10000,
            totalPages: 1,
            currentPage: 1,
          },
          links: {
            first: "",
            previous: "",
            next: "",
            last: "",
          },
        });
      }
    } else {
      alert("Une erreur est survenue lors du traitement de votre commentaire !");
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
          initComments.map((item, i) => (
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

