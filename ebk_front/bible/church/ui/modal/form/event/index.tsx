"use client";

import React, { useState } from "react";
import { DateValue, parseDate } from "@internationalized/date";
// import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Switch } from "@heroui/switch";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import Link from "next/link";

import Alert from "../../alert";

import { capitalize } from "@/app/lib/config/func";
import {
  createEventApi,
  updateEventById,
} from "@/app/lib/actions/management/event/event.req";
import { ManagementEvent } from "@/app/lib/config/interface";

type CreateEventProps = {
  handleFindEvent: () => Promise<void>;
  event?: ManagementEvent;
};

export default function CreateEventFormModal({
  handleFindEvent,
}: CreateEventProps) {
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("Titre de l'événement");
  const [description, setDescription] = useState<string>("description");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [dateEvent] = React.useState<DateValue>(
    parseDate(moment().format("YYYY-MM-DD")),
  );
  const [adressMap, setAdressMap] = useState<string>("");
  const [isFree, setIsFree] = useState<boolean>(false);
  const [totalPerson, setTotalPerson] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // let formatter = useDateFormatter({ dateStyle: "full" });

  const handlAction = async () => {
    setPending(true);
    const dto = {
      name,
      description,
      isBlocked: !isBlocked,
      dateEvent: new Date(dateEvent.toString()),
      adressMap,
      isFree: !isFree,
      totalPerson,
      price,
    };

    const create = await createEventApi(dto);

    setPending(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
    ) {
      handleFindEvent();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof create.message === "object") {
        let message = "";

        create.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    }
  };

  return (
    <>
      <Button size="sm" variant="flat" onClick={onOpen}>
        Créer un événement
      </Button>
      <Modal
        backdrop={"opaque"}
        isOpen={isOpen}
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Créer un événement
              </ModalHeader>
              <ModalBody>
                <Input
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={name === ""}
                  label="Titre de l'événement"
                  placeholder="Titre de l'événement"
                  size="md"
                  value={name}
                  variant="bordered"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Textarea
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={description === ""}
                  label="Description de l'événement"
                  placeholder="Description de l'événement"
                  size="md"
                  value={description}
                  variant="bordered"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <div className="w-full flex flex-col gap-y-2">
                  {/* <DatePicker
                    fullWidth
                    variant="bordered"
                    className="max-w-[284px]"
                    label="Date"
                    value={dateEvent}
                    onChange={setDateEvent}
                  /> */}
                  <p className="text-default-500 text-sm">
                    {moment(dateEvent.toString()).format("dddd")} Le{" "}
                    {moment(dateEvent.toString()).format("DD")},{" "}
                    {moment(dateEvent.toString()).format("MMMM")}{" "}
                    {moment(dateEvent.toString()).format("YYYY")}
                  </p>
                </div>
                <Input
                  label="Lieux de l'événement"
                  placeholder="Lieux de l'événement"
                  size="md"
                  type="url"
                  value={adressMap}
                  variant="bordered"
                  onChange={(e) => {
                    setAdressMap(e.target.value);
                  }}
                />
                <Link
                  className="text-default-500 text-sm"
                  href="https://maps.app.goo.gl/8UYznmNrpBo7ZHS16"
                  target="_blank"
                >
                  ex: https://maps.app.goo.gl/8UYznmNrpBo7ZHS16
                </Link>
                <Input
                  label="Nombre maxmun de réservation"
                  placeholder="nombre maximum"
                  size="md"
                  type="number"
                  value={totalPerson.toString()}
                  variant="bordered"
                  onChange={(e) => {
                    setTotalPerson(parseInt(e.target.value));
                  }}
                />
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">
                    Lance la reservation à la creation:{" "}
                  </p>
                  <Switch isSelected={isBlocked} onValueChange={setIsBlocked} />
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">
                    L&apos;evenement est-il Payant:
                  </p>
                  <Switch isSelected={isFree} onValueChange={setIsFree} />
                </div>
                {isFree && (
                  <Input
                    label="Montant de la réservation"
                    placeholder="Montant"
                    size="md"
                    type="number"
                    value={price.toString()}
                    variant="bordered"
                    onChange={(e) => {
                      setPrice(parseInt(e.target.value));
                    }}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  className="text-white"
                  color="primary"
                  isLoading={pending}
                  onPress={handlAction}
                >
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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

export function UpdateEventFormModal({
  handleFindEvent,
  event,
  isOpen,
  onClose,
}: any) {
  const [pending, setPending] = useState<boolean>(false);

  const dte = moment(event.dateEvent).format("YYYY-MM-DD").toString();
  const [name, setName] = useState<string>(event?.name || "");
  const [description, setDescription] = useState<string>(
    event?.description || "",
  );
  const [isBlocked, setIsBlocked] = useState<boolean>(
    !event?.isBlocked || false,
  );
  const [dateEvent] = React.useState<DateValue>(parseDate(dte));
  const [adressMap, setAdressMap] = useState<string>(event?.adressMap || "");
  const [isFree, setIsFree] = useState<boolean>(!event?.isFree || false);
  const [totalPerson, setTotalPerson] = useState<number>(
    event?.totalPerson || 0,
  );
  const [price, setPrice] = useState<number>(event?.price || 0);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  // let formatter = useDateFormatter({ dateStyle: "full" });

  const handlAction = async () => {
    setPending(true);
    const dto = {
      name,
      description,
      isBlocked: !isBlocked,
      dateEvent: new Date(dateEvent.toString()),
      adressMap,
      isFree: !isFree,
      totalPerson,
      price,
    };

    const create = await updateEventById(event.id, dto);

    setPending(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
    ) {
      handleFindEvent();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof create.message === "object") {
        let message = "";

        create.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    }
  };

  return (
    <>
      <Modal
        backdrop={"opaque"}
        isOpen={isOpen}
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier un événement
              </ModalHeader>
              <ModalBody>
                <Input
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={name === ""}
                  label="Titre de l'événement"
                  placeholder="Titre de l'événement"
                  size="md"
                  value={name}
                  variant="bordered"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Textarea
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={description === ""}
                  label="Description de l'événement"
                  placeholder="Description de l'événement"
                  size="md"
                  value={description}
                  variant="bordered"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <div className="w-full flex flex-col gap-y-2">
                  {/* <DatePicker
                    fullWidth
                    variant="bordered"
                    className="max-w-[284px]"
                    label="Date"
                    value={dateEvent}
                    onChange={setDateEvent}
                  /> */}
                  <p className="text-default-500 text-sm">
                    {capitalize(moment(dateEvent.toString()).format("dddd"))} Le{" "}
                    {moment(dateEvent.toString()).format("DD")},{" "}
                    {moment(dateEvent.toString()).format("MMMM")}{" "}
                    {moment(dateEvent.toString()).format("YYYY")}
                  </p>
                </div>
                <Input
                  label="Lieux de l'événement"
                  placeholder="Lieux de l'événement"
                  size="md"
                  type="url"
                  value={adressMap}
                  variant="bordered"
                  onChange={(e) => {
                    setAdressMap(e.target.value);
                  }}
                />
                <Link
                  className="text-default-500 text-sm"
                  href="https://maps.app.goo.gl/8UYznmNrpBo7ZHS16"
                  target="_blank"
                >
                  ex: https://maps.app.goo.gl/8UYznmNrpBo7ZHS16
                </Link>
                <Input
                  label="Nombre maxmun de réservation"
                  placeholder="nombre maximum"
                  size="md"
                  type="number"
                  value={totalPerson.toString()}
                  variant="bordered"
                  onChange={(e) => {
                    setTotalPerson(parseInt(e.target.value));
                  }}
                />
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">
                    Lance la reservation à la creation:{" "}
                  </p>
                  <Switch isSelected={isBlocked} onValueChange={setIsBlocked} />
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">
                    L&apos;evenement est-il Payant:
                  </p>
                  <Switch isSelected={isFree} onValueChange={setIsFree} />
                </div>
                {isFree && (
                  <Input
                    label="Montant de la réservation"
                    placeholder="Montant"
                    size="md"
                    type="number"
                    value={price.toString()}
                    variant="bordered"
                    onChange={(e) => {
                      setPrice(parseInt(e.target.value));
                    }}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  className="text-white"
                  color="primary"
                  isLoading={pending}
                  onPress={handlAction}
                >
                  Modifier
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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

export function EventSubscribeFormModal({
  event,
  isOpen,
  onClose,
}: {
  event: ManagementEvent;
  isOpen: boolean;
  onClose: () => void;
}) {
  // const [pending, setPending] = useState<boolean>(false);
  const [subscribe] = useState<any[]>(
    Array.isArray(event.subscribe) ? event.subscribe : [],
  );

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg] = useState<string>("");
  const [alertTitle] = useState<string>("");

  // let formatter = useDateFormatter({ dateStyle: "full" });

  // const handlAction = async () => {
  //   setPending(true);

  //   setPending(false);
  // };

  return (
    <>
      <Modal
        backdrop={"opaque"}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onClose={onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Liste de réservation de l&apos;événement
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between">
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Total de reservation</p>
                    <p>
                      {event.totalSubscriptions} / {event.totalPerson}
                    </p>
                  </div>
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Montant Total</p>
                    {event.isFree ? (
                      <p>L&apos;événement est gratuit</p>
                    ) : (
                      <p>{event.totalSubscriptions * event.price} USD</p>
                    )}
                  </div>
                </div>
                <div>
                  <Table
                    fullWidth
                    isStriped
                    aria-label="Example static collection table"
                  >
                    <TableHeader>
                      <TableColumn>#</TableColumn>
                      <TableColumn>Fidel</TableColumn>
                      <TableColumn>Date de la reservation</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {subscribe.map((item, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>
                              {item.user.nom} {item.user.prenom}
                            </TableCell>
                            <TableCell>
                              Le {moment(item.createdAt).format("DD-MM-YYYY")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
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
