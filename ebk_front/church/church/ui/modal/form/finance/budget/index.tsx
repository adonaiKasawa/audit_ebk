"use client";

import React, { useState } from "react";
import { DateValue, parseDate } from "@internationalized/date";
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
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import Alert from "@/ui/modal/alert";
import {
  createManagementBudgetApi,
  createManagementSubPrevisionBudgetApi,
  updateManagementBudgetApi,
} from "@/app/lib/actions/management/finance/finance.req";
import { ManagementBudget } from "@/app/lib/config/interface";

type CreateBudgetProps = {
  handleFindBudget: () => Promise<void>;
  event?: ManagementBudget;
};

type SubPrevisionBudget = {
  description: string;
  qt: number;
  unitPrice: number;
  dateExpense: DateValue;
};

export default function CreateBudgetFormModal({
  handleFindBudget,
}: CreateBudgetProps) {
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [budgetLine, setBudgetLine] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [period] = React.useState<DateValue>(
    parseDate(moment().format("YYYY-MM-DD")),
  );
  // const [amount, setAmount] = useState<number>(0);
  const [subPrevisionBudget, setSubPrevisionBudget] = useState<
    SubPrevisionBudget[]
  >([
    {
      description: "",
      qt: 0,
      unitPrice: 0,
      dateExpense: parseDate(moment().format("YYYY-MM-DD")),
    },
  ]);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleAddSubPrevisionBudgetForm = () => {
    const lastIndex = subPrevisionBudget.length - 1;
    const lastItem = subPrevisionBudget[lastIndex];

    if (
      lastItem.description !== "" &&
      lastItem.qt !== 0 &&
      lastItem.unitPrice !== 0
    ) {
      setSubPrevisionBudget([
        ...subPrevisionBudget,
        {
          description: "",
          qt: 0,
          unitPrice: 0,
          dateExpense: parseDate(moment().format("YYYY-MM-DD")),
        },
      ]);
    } else {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      setAlertMsg("Veillez remplir le dérnier prévision correctement!");
    }
  };

  // const handleResetSubPrevisionBudgetForm = () => {
  //   setSubPrevisionBudget([
  //     {
  //       description: "",
  //       qt: 0,
  //       unitPrice: 0,
  //       dateExpense: parseDate(moment().format("YYYY-MM-DD")),
  //     },
  //   ]);
  // };

  const getTotalAmount = (subPrevisions: SubPrevisionBudget[]): number => {
    return subPrevisions.reduce((total, item) => {
      return total + item.qt * item.unitPrice;
    }, 0);
  };

  const isSubPrevisionBudgetValid = (
    subPrevision: SubPrevisionBudget,
  ): boolean => {
    return (
      subPrevision.description.trim() !== "" &&
      subPrevision.qt > 0 &&
      subPrevision.unitPrice > 0 &&
      subPrevision.dateExpense.toString().trim() !== ""
    );
  };

  const hasValidSubPrevision = (
    subPrevisions: SubPrevisionBudget[],
  ): boolean => {
    return subPrevisions.some(isSubPrevisionBudgetValid);
  };

  const handlAction = async () => {
    if (hasValidSubPrevision(subPrevisionBudget)) {
      setPending(true);
      const dto = {
        budgetLine,
        description,
        period: new Date(period.toString()),
        amount: getTotalAmount(subPrevisionBudget),
      };
      const create = await createManagementBudgetApi(dto);

      setPending(false);

      if (
        !create.hasOwnProperty("statusCode") &&
        (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
      ) {
        setPending(true);
        const data = {
          dto: subPrevisionBudget.map((item) => ({
            ...item,
            dateExpense: new Date(item.dateExpense.toString()),
          })),
        };
        const addSubPrevision = await createManagementSubPrevisionBudgetApi(
          data,
          create.id,
        );

        setPending(false);
        if (
          !addSubPrevision.hasOwnProperty("statusCode") &&
          (!addSubPrevision.hasOwnProperty("error") ||
            !addSubPrevision.hasOwnProperty("error"))
        ) {
          handleFindBudget();
          onClose();
        } else {
          onClose();
          setOpenAlert(true);
          setAlertTitle("Message d'erreur");
          if (typeof addSubPrevision.message === "object") {
            let message = "";

            addSubPrevision.message.map(
              (item: string) => (message += `${item} \n`),
            );
            setAlertMsg(message);
          } else {
            setAlertMsg(addSubPrevision.message);
          }
        }
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
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      setAlertMsg("Aucune prévision budgétaire n'est valide.");
    }
  };

  return (
    <>
      <Button size="sm" variant="flat" onClick={onOpen}>
        Créer une ligne budgetaire
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
                Créer une ligne budgetaire
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Ligne budgetaire"
                  placeholder="Ligne budgetaire"
                  size="sm"
                  value={budgetLine}
                  variant="bordered"
                  onChange={(e) => {
                    setBudgetLine(e.target.value);
                  }}
                />
                <Textarea
                  label="Description de la ligne budgetaire"
                  placeholder="Description de la ligne budgetaire"
                  size="sm"
                  value={description}
                  variant="bordered"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <div className="w-full flex flex-col gap-y-2">
                  {/* <DatePicker
                    fullWidth
                    size="sm"
                    variant="bordered"
                    label="Date"
                    value={period}
                    onChange={setPeriod}
                  /> */}
                  <p className="text-default-500 text-sm">
                    Période du {moment(period.toString()).format("MMMM")}{" "}
                    {moment(period.toString()).format("YYYY")}
                  </p>
                </div>

                <p className="text-xl">Détail de la prévision budgétaire</p>
                <div className="m-4">
                  {subPrevisionBudget.map((_, i) => (
                    <AddSubPrevisionBudgetComponent
                      key={i}
                      index={i}
                      setSubPrevisionBudget={setSubPrevisionBudget}
                      subPrevisionBudget={subPrevisionBudget}
                    />
                  ))}
                </div>
                {/* <Input
                  size="sm"
                  label="Montant"
                  variant="bordered"
                  type="number"
                  value={amount.toString()}
                  onChange={(e) => { setAmount(parseInt(e.target.value)) }}
                  placeholder="Montant"
                /> */}
                <div className="flex justify-end items-center">
                  <Button
                    className="bg-primary text-white mb-5"
                    type="button"
                    onClick={handleAddSubPrevisionBudgetForm}
                  >
                    Ajouter une prévision
                  </Button>
                </div>
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

export function UpdateBudgetFormModal({
  handleFindEvent,
  budget,
  isOpen,
  onClose,
}: any) {
  const [pending, setPending] = useState<boolean>(false);

  const [budgetLine, setBudgetLine] = useState<string>(budget.budgetLine);
  const [description, setDescription] = useState<string>(budget.description);
  const [period] = React.useState<DateValue>(
    parseDate(moment(budget.period).format("YYYY-MM-DD")),
  );
  const [amount, setAmount] = useState<number>(budget.amount);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handlAction = async () => {
    setPending(true);
    const dto = {
      budgetLine,
      description,
      period: new Date(period.toString()),
      amount,
    };

    const create = await updateManagementBudgetApi(dto, budget.id);

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
                Modifier la ligne budgetaire
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Ligne budgetaire"
                  placeholder="Ligne budgetaire"
                  size="md"
                  value={budgetLine}
                  variant="bordered"
                  onChange={(e) => {
                    setBudgetLine(e.target.value);
                  }}
                />
                <Textarea
                  label="Description de la ligne budgetaire"
                  placeholder="Description de la ligne budgetaire"
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
                    value={period}
                    onChange={setPeriod}
                  /> */}
                  <p className="text-default-500 text-sm">
                    Période du {moment(period.toString()).format("MMMM")}{" "}
                    {moment(period.toString()).format("YYYY")}
                  </p>
                </div>

                <Input
                  label="Montant"
                  placeholder="Montant"
                  size="md"
                  type="number"
                  value={amount.toString()}
                  variant="bordered"
                  onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                  }}
                />
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

export function AddSubPrevisionBudgetComponent({
  index,
  subPrevisionBudget,
  setSubPrevisionBudget,
}: {
  index: number;
  subPrevisionBudget: SubPrevisionBudget[];
  setSubPrevisionBudget: React.Dispatch<
    React.SetStateAction<SubPrevisionBudget[]>
  >;
}) {
  const handleChange = (
    input: keyof SubPrevisionBudget,
    value: SubPrevisionBudget[keyof SubPrevisionBudget],
  ) => {
    setSubPrevisionBudget((prev) => {
      const newSubPrevisionBudget = [...prev];

      const formToUpdate: any = { ...newSubPrevisionBudget[index] };

      formToUpdate[input] = value;

      newSubPrevisionBudget[index] = formToUpdate;

      return newSubPrevisionBudget;
    });
  };

  const removeSubPrevisionBudget = () => {
    setSubPrevisionBudget((prev) => {
      const newSubPrevisionBudget = prev.filter((_, i) => i !== index);

      return newSubPrevisionBudget;
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-2">
      <Input
        label="Déscription"
        name="description"
        placeholder="Déscription"
        type="text"
        value={subPrevisionBudget[index].description}
        variant="bordered"
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <Input
        label="Prix unitaire"
        name="unitPrice"
        placeholder="Prix unitaire"
        type="number"
        value={subPrevisionBudget[index].unitPrice.toString()}
        variant="bordered"
        onChange={(e) => handleChange("unitPrice", parseInt(e.target.value))}
      />
      <Input
        label="Quantité"
        name="qt"
        placeholder="Quantité"
        type="text"
        value={subPrevisionBudget[index].qt.toString()}
        variant="bordered"
        onChange={(e) => handleChange("qt", parseInt(e.target.value))}
      />
      <div className="w-full flex flex-col gap-y-2">
        {/* <DatePicker
        fullWidth
        size="sm"
        variant="bordered"
        label="Période de la depense"
        value={subPrevisionBudget[index].dateExpense}
        onChange={(e) => handleChange("dateExpense", e)}
      /> */}
        <p className="text-default-500 text-sm">
          Période du{" "}
          {moment(subPrevisionBudget[index].dateExpense.toString()).format(
            "MMMM",
          )}{" "}
          {moment(subPrevisionBudget[index].dateExpense.toString()).format(
            "YYYY",
          )}
        </p>
      </div>
      {subPrevisionBudget.length > 1 && (
        <div className="flex justify-end">
          <Button
            color="danger"
            size="sm"
            variant="bordered"
            onClick={removeSubPrevisionBudget}
          >
            Supprimer
          </Button>
        </div>
      )}
    </div>
  );
}

export function SubPrevisionFormModal({
  budget,
  isOpen,
  onClose,
}: {
  budget: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  // const [pending, setPending] = useState<boolean>(false);
  const [subPrevision] = useState<any[]>(
    Array.isArray(budget.subPrevision) ? budget.subPrevision : [],
  );

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg] = useState<string>("");
  const [alertTitle] = useState<string>("");

  // const getTotalAmount = (subPrevisions: SubPrevisionBudget[]): number => {
  //   return subPrevisions.reduce((total, item) => {
  //     return total + item.qt * item.unitPrice;
  //   }, 0);
  // };

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
                Liste de prevision budgetaire:
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between">
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Total de prévision</p>
                    <p>{subPrevision.length}</p>
                  </div>
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Montant Total</p>
                    <p> {budget.amount} USD</p>
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
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Quantité</TableColumn>
                      <TableColumn>Print unitaire</TableColumn>
                      <TableColumn>Print total</TableColumn>
                      <TableColumn>Période de la depense</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {subPrevision.map((item, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.qt}</TableCell>
                            <TableCell>{item.unitPrice}</TableCell>
                            <TableCell>{item.unitPrice * item.qt}</TableCell>
                            <TableCell>
                              Le {moment(item.dateExpense).format("DD-MM-YYYY")}
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
