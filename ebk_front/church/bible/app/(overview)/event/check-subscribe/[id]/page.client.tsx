"use client";

import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { BsEmojiFrown } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { BsEmojiNeutral } from "react-icons/bs";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { CircularProgress } from "@heroui/progress";
import { Image } from "@heroui/image";

import { findCheckedSubscribeUserEventByuuIdApi } from "@/app/lib/actions/management/event/event.req";
import { capitalize } from "@/app/lib/config/func";
import { file_url } from "@/app/lib/request/request";

export default function EventByIdClientPage({
  params,
}: {
  params: { id: string };
}) {
  const [pending, setPending] = useState<boolean>(true);
  const [, setOpenAlert] = useState<boolean>(false);
  const [, setAlertTitle] = useState<string>("");
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [checkTicket, setCheckTikect] = useState<any>();

  const handle = useCallback(async () => {
    setPending(true);
    const checkEvent = await findCheckedSubscribeUserEventByuuIdApi(params.id);

    setPending(false);
    if (
      checkEvent.hasOwnProperty("statusCode") &&
      checkEvent.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof checkEvent.message === "object") {
        let message = "";

        checkEvent.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(checkEvent.message);
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("vérification réussi");
      setAlertMsg("La vérification du ticket se bien passée.");
      setCheckTikect(checkEvent);
    }
  }, [params]);

  useEffect(() => {
    handle();
  }, [handle]);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      {pending ? (
        <CircularProgress aria-label="Loading..." color="default" size="lg" />
      ) : checkTicket ? (
        <Card className="h-[500px] bg-success w-[548px] rounded-md">
          <CardBody className="flex flex-col items-center gap-4 justify-center">
            {checkTicket.event.annonces.length > 0 && (
              <Image
                alt="annonce_contente"
                height={300}
                src={`${file_url}${checkTicket.event.annonces[0].contente}`}
                width={300}
              />
            )}
            <p>{checkTicket.event.name}</p>
            <p>
              Date de l&apos;événemnt{" "}
              {capitalize(
                moment(checkTicket.event.dateEvent).format(
                  "dddd, DD MMMM YYYY",
                ),
              )}
            </p>
            <Divider />
            {checkTicket.user.profil && (
              <Image
                alt="user_profil"
                height={300}
                src={`${file_url}${checkTicket.user.profil}`}
                style={{ borderRadius: 25 }}
                width={300}
              />
            )}
            <p className="uppercase">
              {checkTicket.user.prenom} {checkTicket.user.nom}
            </p>
            <p className="uppercase">{checkTicket.user.telephone}</p>
            <p>
              Date de la réservation{" "}
              {capitalize(
                moment(checkTicket.createdAt).format("dddd, DD MMMM YYYY"),
              )}
            </p>
            <p className="text-2xl text-white">Le ticker est valide</p>
            <BsEmojiSmile className="mt-4" size={100} />
          </CardBody>
        </Card>
      ) : (
        <Card
          className={`h-[500px] bg-${alertMsg === "warning" ? "warining" : "danger"} w-[548px] rounded-md`}
        >
          <CardBody className="flex flex-col items-center justify-center">
            <p className="text-2xl text-white uppercase text-center">
              {alertMsg === "warning"
                ? "Ce ticker a déjà été vérifier"
                : alertMsg}
            </p>
            {alertMsg === "warning" ? (
              <BsEmojiNeutral className="mt-4" size={100} />
            ) : (
              <BsEmojiFrown className="mt-4" size={100} />
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
