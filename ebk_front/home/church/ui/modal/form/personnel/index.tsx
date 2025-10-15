"use client";

import React, { useState } from "react";
import { useAsyncList } from "@react-stately/data";
import { Session } from "next-auth";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import Alert from "../../alert";
import DialogAction from "../../dialog";

import { api_url, file_url } from "@/app/lib/request/request";
import { Users } from "@/app/lib/config/interface";
import { SearchIcon } from "@/ui/icons";
import { addManagementPersonnelApi } from "@/app/lib/actions/management/personnel/mange.person.req";

// type SWCharacter = {
//   name: string;
//   height: string;
//   mass: string;
//   birth_year: string;
// };

export function AddPersonneMembreFormModal({
  handleFindPersonneMemebres,
  session,
}: {
  handleFindPersonneMemebres: () => Promise<void>;
  session: Session;
}) {
  const [userSelected, setUserSelected] = useState<Users>();

  const [openModal, setOpenModal] = useState<boolean>(false);
  // loading
  const [, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const id_eglise = session.user.eglise.id_eglise;

  let list = useAsyncList<Users>({
    async load({ signal }) {
      let res = await fetch(
        `${api_url}eglise/findMembreByEgliseId/${id_eglise}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token.access_token}`,
          },
          signal,
        },
      );

      let json = res.ok && res.status === 200 ? await res.json() : [];

      return {
        items: json,
      };
    },
  });

  const handleSubmit = async () => {
    if (userSelected) {
      setLoading(true);
      const create = await addManagementPersonnelApi({
        userId: userSelected.id,
      });

      setLoading(false);

      if (
        create.hasOwnProperty("statusCode") &&
        (create.hasOwnProperty("error") || create.hasOwnProperty("error"))
      ) {
        setOpenAlert(true);
        setAlertTitle("Message d'erreur");
        if (typeof create.message === "object") {
          let message = "";

          create.message.map((item: string) => (message += `${item} \n`));
          setAlertMsg(message);
        } else {
          setAlertMsg(create.message);
        }
      } else {
        setAlertTitle("Message");
        handleFindPersonneMemebres();
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Champs obligatoires");
      setAlertMsg("Le nom, prenom et le numéro de télephone sont obligatoires");
    }
  };

  const onSelectionChange = (key: string | number | null) => {
    if (key !== null) {
      const user = list.items.find((item) => item.id === parseInt(`${key}`));

      if (user) {
        setOpenModal(() => true);
        setUserSelected(user);
      }
    }
  };

  return (
    <>
      <Autocomplete
        aria-label="Select an employee"
        classNames={{
          base: "max-w-[320px]",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={list.items}
        inputProps={{
          classNames: {
            input: "ml-1",
            inputWrapper: "h-[48px]",
          },
        }}
        inputValue={list.filterText}
        isLoading={list.isLoading}
        listboxProps={{
          hideSelectedIcon: true,
          itemClasses: {
            base: [
              "rounded-medium",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "dark:data-[hover=true]:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[hover=true]:bg-default-200",
              "data-[selectable=true]:focus:bg-default-100",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        placeholder="Ajouter du personnel"
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-large",
            content: "p-1 border-small border-default-100 bg-background",
          },
        }}
        radius="full"
        startContent={
          <SearchIcon className="text-default-400" strokeWidth={2.5} />
        }
        variant="bordered"
        onInputChange={list.setFilterText}
        onSelectionChange={onSelectionChange}
      >
        {(item) => (
          <AutocompleteItem
            key={item.id}
            textValue={`${item.telephone} ${item.nom} ${item.prenom} ${item.username} `}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={`${item.username}`}
                  className="flex-shrink-0"
                  size="sm"
                  src={`${file_url}${item.profil}`}
                />
                <div className="flex flex-col">
                  <span className="text-small">
                    {item.nom} {item.prenom}
                  </span>
                  <span className="text-tiny text-default-400">
                    {item.email}
                  </span>
                </div>
              </div>
              <Button
                className="border-small mr-0.5 font-medium shadow-small"
                radius="full"
                size="sm"
                variant="bordered"
              >
                Ajouter
              </Button>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
      {userSelected && (
        <DialogAction
          action={handleSubmit}
          dialogBody={
            <div className="flex flex-col gap-4 items-center justify-center">
              <p>Voulez-vous vraiment ajouter</p>
              <div className="flex flex-col items-center justify-center">
                <Avatar
                  alt={`${userSelected.username}`}
                  className="flex-shrink-0"
                  size="lg"
                  src={`${file_url}${userSelected.profil}`}
                />
                <p className="font-bold">
                  {userSelected.nom} {userSelected.prenom}
                </p>
                <p className="text-tiny text-default-400">
                  @{userSelected.username}
                </p>
                <p className="text-tiny text-default-400">
                  {userSelected.email}
                </p>
                <p className="text-tiny text-default-400">
                  {userSelected.telephone}
                </p>
              </div>
            </div>
          }
          dialogTitle={"Ajouter ce mombre dans l'équipe"}
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          onOpen={() => {
            setOpenModal(true);
          }}
        />
      )}
      <Alert
        alertBody={<p className="text-center">{alertMsg}</p>}
        alertTitle={alertTitle}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </>
  );
}
