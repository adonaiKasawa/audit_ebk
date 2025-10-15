import React, { useState } from "react";
import { Session } from "next-auth";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

import Loading from "../loading/page";

import { sendChurchMessageApi } from "@/app/lib/actions/church/church";
import { Eglise } from "@/app/lib/config/interface";

export default function NousContacterSite({
  eglise,
  session,
}: {
  eglise: Eglise;
  session: Session | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const [name] = useState<string>(
    `${session?.user?.nom || ""} ${session?.user?.prenom || ""}`,
  );
  const [email] = useState<string>(
    session?.user.email ? session?.user.email : "",
  );
  const [phoneNumer] = useState<string>(
    session?.user?.telephone ? session?.user?.telephone : "",
  );
  const [message] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    await sendChurchMessageApi(
      {
        nom: name,
        telephone: phoneNumer,
        email,
        message,
      },
      eglise.id_eglise,
    );
    setLoading(false);
  };

  return (
    <div>
      <h1 className="title_site text-4xl text-center">Nous contacter</h1>
      <form
        className="flex w-full items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col  w-1/2 gap-4">
          <Input
            fullWidth
            label="Nom et post-nom"
            type="text"
            value={`${session?.user?.nom || ""} ${session?.user?.prenom || ""}`}
            variant="bordered"
          />
          <Input
            fullWidth
            label="Email"
            placeholder="Votre adresse mail"
            type="email"
            value={session?.user?.email}
            variant="bordered"
          />
          <Input
            fullWidth
            label="Numero de téléphone"
            placeholder="Numero de téléphone"
            type="text"
            value={session?.user?.telephone || ""}
            variant="bordered"
          />
          <Textarea
            disableAnimation
            disableAutosize
            fullWidth
            classNames={{
              input: "resize-y min-h-[40px]",
            }}
            label="Message"
            placeholder="Votre message"
            variant="bordered"
          />
          {loading ? (
            <Loading />
          ) : (
            <Button color="primary" type="submit">
              Envoyer
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
