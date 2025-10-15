import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useState } from "react";
import { Input } from "@heroui/input";
import { CiTrash } from "react-icons/ci";
import moment from "moment";

import Alert from "../../alert";

import {
  createDayApi,
  deleteDayApi,
  postponeAppointmentApi,
} from "@/app/lib/actions/appointment/appoint.req";
import "moment/locale/fr";

export function AddDayForAppointment({
  handleFindDay,
}: {
  handleFindDay: () => void;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [jour, setJour] = useState<string>();
  const [limite, setLimite] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (jour && limite && startTime && endTime) {
      setLoading(true);
      const create = await createDayApi({ jour, limite, startTime, endTime });

      setLoading(false);
      if (
        create.hasOwnProperty("statusCode") &&
        create.hasOwnProperty("error")
      ) {
        setAlertMsg(
          "Une erreur se produite lors de la création de commuiqués.",
        );
        setOpenAlert(true);
      } else {
        handleFindDay();
        setJour("");
        setOpenModal(false);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Ajouter un jour
      </Button>
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
                {" "}
                Ajouter un jour de rendez-vous
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4 justify-between"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Input
                    label="Jour"
                    value={jour}
                    onChange={(e) => {
                      setJour(e.target.value);
                    }}
                  />
                  <Input
                    label="Limite de visite"
                    type="number"
                    value={limite.toString()}
                    onChange={(e) => {
                      setLimite(parseInt(e.target.value));
                    }}
                  />
                  <Input
                    label="Heure du début"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                    }}
                  />
                  <Input
                    label="Heure du fin"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                    }}
                  />
                  <Button
                    className="bg-primary text-white mt-4"
                    isLoading={loading}
                    type="submit"
                  >
                    Créer
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
        <Alert
          alertBody={<p>{alertMsg}</p>}
          alertTitle={"Erreur"}
          isOpen={openAlert}
          onClose={() => {
            setOpenAlert(false);
          }}
          onOpen={() => {
            setOpenAlert(true);
          }}
        />
      </Modal>
    </>
  );
}

export function ListOfDayForAppointment({
  day,
  setDay,
}: {
  day: any[];
  setDay: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Liste de jour
      </Button>
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
                List de jour
              </ModalHeader>
              <ModalBody>
                <table className="table table-auto">
                  <thead>
                    <th>#</th>
                    <th>Jour</th>
                    <th>Limite</th>
                    <th>Heure</th>
                    <th>Actions</th>
                  </thead>
                  <tbody className="text-center">
                    {day.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.jour.toUpperCase()}</td>
                        <td>{item.limite}</td>
                        <td>
                          {moment(item?.startTime).format("LT")} à{" "}
                          {moment(item?.endTime).format("LT")}
                        </td>
                        <td>
                          <DeleteDayComponent
                            day={day}
                            id={item.id}
                            setAlertMsg={setAlertMsg}
                            setDay={setDay}
                            setOpenAlert={setOpenAlert}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={"Erreur"}
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

const DeleteDayComponent = ({
  setOpenAlert,
  setAlertMsg,
  setDay,
  day,
  id,
}: {
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMsg: React.Dispatch<React.SetStateAction<string>>;
  setDay: React.Dispatch<React.SetStateAction<any[]>>;
  day: any[];
  id: number;
}) => {
  const [pending, setPending] = useState<boolean>(false);

  const handleDeleteDay = async () => {
    setPending(true);
    const delet = await deleteDayApi(id);

    setPending(false);

    if (delet.hasOwnProperty("statusCode") && delet.hasOwnProperty("error")) {
      setOpenAlert(true);
      setAlertMsg(delet.message);
    } else {
      setDay(day.filter((item) => item.id !== id));
    }
  };

  return (
    <Button
      isIconOnly
      color="danger"
      isLoading={pending}
      size="sm"
      variant="light"
      onClick={() => {
        handleDeleteDay();
      }}
    >
      <CiTrash size={24} />
    </Button>
  );
};

export function ReporterAppointmentFormModal({
  openModal,
  appointment,
  setOpenModal,
  handleFindAppointment,
}: {
  openModal: boolean;
  appointment: any;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  handleFindAppointment: any;
}) {
  const [pending, setPending] = useState<boolean>(false);
  const [motif, setMotif] = useState<string>(appointment.motif);
  const [dateAppointment, setDateAppointment] = useState<string>(
    appointment.postpone
      ? appointment.postponeDate.toString()
      : appointment.requestDate.toString(),
  );
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handlePostPoneAppointment = async () => {
    if (motif && dateAppointment) {
      if (
        dateAppointment !== appointment.postponeDate &&
        dateAppointment !== appointment.requestDate
      ) {
        setPending(true);
        const req = await postponeAppointmentApi(
          { postponeDate: dateAppointment, motif },
          appointment.id,
        );

        setPending(false);
        if (req.hasOwnProperty("statusCode") && req.hasOwnProperty("error")) {
          setOpenAlert(true);
          setAlertMsg(req.message);
          setAlertTitle("Erreur");
        } else {
          handleFindAppointment();
        }
      } else {
        setOpenAlert(true);
        setAlertMsg("La date doit est correcte et differente dans l'ancienne");
        setAlertTitle("Erreur");
      }
    } else {
      setOpenAlert(true);
      setAlertMsg("Les champts sont obligatoire");
      setAlertTitle("Erreur");
    }
  };

  return (
    <>
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
                Réporter le rendez-vous
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePostPoneAppointment();
                  }}
                >
                  {appointment.postpone &&
                    "Cet rendez-vous a déjà était répoter au moins une fois."}
                  <Input
                    label="Évenement"
                    type="text"
                    value={motif}
                    onChange={(e) => {
                      setMotif(e.target.value);
                    }}
                  />
                  <Input
                    className="mt-4"
                    label="Heure du début"
                    type="datetime-local"
                    value={dateAppointment}
                    onChange={(e) => {
                      setDateAppointment(e.target.value);
                    }}
                  />
                  <Button
                    className="bg-primary text-white mt-4"
                    isLoading={pending}
                    type="submit"
                  >
                    Réporter
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
        <Alert
          alertBody={<p>{alertMsg}</p>}
          alertTitle={alertTitle}
          isOpen={openAlert}
          onClose={() => {
            setOpenAlert(false);
          }}
          onOpen={() => {
            setOpenAlert(true);
          }}
        />
      </Modal>
    </>
  );
}
