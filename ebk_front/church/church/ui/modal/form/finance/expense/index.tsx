"use client";

import React, { useEffect, useState } from "react";
// import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { Session } from "next-auth";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import Alert from "@/ui/modal/alert";
import {
  createManagementExpensesApi,
  findManagementBudgetByEgliseIdApi,
  updateManagementExpenseApi,
} from "@/app/lib/actions/management/finance/finance.req";
import { ManagementBudget, ManagementIncome } from "@/app/lib/config/interface";

type CreateIncomeProps = {
  handleFindExpense: () => Promise<void>;
  income?: ManagementIncome;
  session: Session;
};

export default function CreateExpenseFormModal({
  session,
  handleFindExpense,
}: CreateIncomeProps) {
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [budgetId, setBudgetId] = useState<number>(0);
  const [motif, setMethod] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [budgets, setbudgets] = useState<ManagementBudget[]>([]);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // let formatter = useDateFormatter({ dateStyle: "full" });

  const handleFindBudget = async () => {
    if (session) {
      const find = await findManagementBudgetByEgliseIdApi(
        session.user.eglise.id_eglise,
      );

      if (find) {
        const r: ManagementBudget[] = [];

        find.map((item: ManagementBudget) => {
          if (item.income && item.income.length > 0) {
            r.push(item);
          }
        });
        setbudgets(r);
      }
    }
  };

  const handlAction = async () => {
    setPending(true);
    const dto = {
      budgetId,
      motif,
      amount,
    };

    const create = await createManagementExpensesApi(dto);

    setPending(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
    ) {
      handleFindExpense();
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

  useEffect(() => {
    handleFindBudget();
  }, []);

  return (
    <>
      <Button size="sm" variant="flat" onClick={onOpen}>
        Effectuer une dépense
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
                Effectuer une dépense
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Montant de la dépense"
                  placeholder="Montant de la dépense"
                  size="md"
                  type="number"
                  value={amount.toString()}
                  variant="bordered"
                  onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                  }}
                />
                <Textarea
                  label="Motif de la dépense"
                  placeholder="Motif de la dépense"
                  size="md"
                  value={motif}
                  variant="bordered"
                  onChange={(e) => {
                    setMethod(e.target.value);
                  }}
                />
                <Select
                  fullWidth
                  required
                  aria-label="1"
                  className="mb-2"
                  label="Ligne budgetaire"
                  placeholder="Assicier la recette à une ligne budgetaire"
                  value={budgetId}
                  onChange={(e) => {
                    setBudgetId(parseInt(e.target.value));
                  }}
                >
                  {budgets.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      // value={cat.id}
                      textValue={cat.budgetLine}
                    >
                      {cat.budgetLine} - {moment(cat.period).format("MM-YYYY")}
                    </SelectItem>
                  ))}
                </Select>
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

export function UpdateExpenseFormModal({
  handleFindExpense,
  expense,
  isOpen,
  onClose,
  session,
}: any) {
  const [pending, setPending] = useState<boolean>(false);

  const [motif, setMethod] = useState<string>(expense.motif);
  const [amount, setAmount] = useState<number>(expense.amount);
  const [budgetId, setBudgetId] = useState<number>(
    expense.budget ? expense.budget.id : 0,
  );

  const [budgets, setbudgets] = useState<ManagementBudget[]>([]);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleFindBudget = async () => {
    if (session) {
      const find = await findManagementBudgetByEgliseIdApi(
        session.user.eglise.id_eglise,
      );

      if (find) {
        const r: ManagementBudget[] = [];

        find.map((item: ManagementBudget) => {
          if (item.income && item.income.length > 0) {
            r.push(item);
          }
        });
        setbudgets(r);
      }
    }
  };

  useEffect(() => {
    handleFindBudget();
  }, []);

  const handlAction = async () => {
    setPending(true);
    const dto = {
      budgetId,
      motif,
      amount,
    };

    const create = await updateManagementExpenseApi(dto, expense.id);

    setPending(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
    ) {
      handleFindExpense();
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
                Modifier la dépense
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Montant de la dépense"
                  placeholder="Montant de la dépense"
                  size="md"
                  type="number"
                  value={amount.toString()}
                  variant="bordered"
                  onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                  }}
                />
                <Textarea
                  label="Motif de la dépense"
                  placeholder="Motif de la dépense"
                  size="md"
                  value={motif}
                  variant="bordered"
                  onChange={(e) => {
                    setMethod(e.target.value);
                  }}
                />
                <Select
                  fullWidth
                  required
                  aria-label="1"
                  className="mb-2"
                  label="Ligne budgetaire"
                  placeholder="Assicier la recette à une ligne budgetaire"
                  value={budgetId}
                  onChange={(e) => {
                    setBudgetId(parseInt(e.target.value));
                  }}
                >
                  {budgets.map((cat) => {
                    return (
                      <SelectItem
                        key={cat.id}
                        textValue={cat.budgetLine}
                        // value={cat.id}
                      >
                        {cat.budgetLine} -{" "}
                        {moment(cat.period).format("MM-YYYY")}
                      </SelectItem>
                    );
                  })}
                </Select>
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
