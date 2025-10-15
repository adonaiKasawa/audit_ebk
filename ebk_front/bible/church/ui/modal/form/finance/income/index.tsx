"use client";

import React, { useEffect, useState } from "react";
// import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";

import Alert from "@/ui/modal/alert";
import {
  createManagementIncomeApi,
  findManagementBudgetByEgliseIdApi,
  updateManagementIncomeApi,
} from "@/app/lib/actions/management/finance/finance.req";
import { ManagementBudget, ManagementIncome } from "@/app/lib/config/interface";

type CreateIncomeProps = {
  handleFindIncome: () => Promise<void>;
  income?: ManagementIncome;
};

export default function CreateIncomeFormModal({
  handleFindIncome,
}: CreateIncomeProps) {
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [source, setSource] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // let formatter = useDateFormatter({ dateStyle: "full" });

  const handlAction = async () => {
    setPending(true);
    const dto = {
      source,
      method,
      amount,
    };

    const create = await createManagementIncomeApi(dto);

    setPending(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
    ) {
      handleFindIncome();
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
        Créer une récette
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
                Créer une récette
              </ModalHeader>
              <ModalBody>
                <Input
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={source === ""}
                  label="Source de la recette"
                  placeholder="Source de la recette"
                  size="md"
                  value={source}
                  variant="bordered"
                  onChange={(e) => {
                    setSource(e.target.value);
                  }}
                />
                <p className="text-sm text-default-500">
                  ex: Dîme, Offrand, Don, Événement
                </p>
                <Input
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={method === ""}
                  label="Method d'acquisition"
                  placeholder="Source de la recette"
                  size="md"
                  value={method}
                  variant="bordered"
                  onChange={(e) => {
                    setMethod(e.target.value);
                  }}
                />
                <p className="text-sm text-default-500">
                  ex: Bank, Mobil Money, Cash
                </p>
                <Input
                  label=" Montant"
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

export function UpdateIncomeFormModal({
  handleFindIncome,
  income,
  isOpen,
  onClose,
  session,
}: any) {
  const [pending, setPending] = useState<boolean>(false);

  const [source, setSource] = useState<string>(income.source);
  const [method, setMethod] = useState<string>(income.method);
  const [amount, setAmount] = useState<number>(income.amount);
  const [budgetId, setbudget] = useState<string>(
    income.budget ? income.budget.id.toString() : 0,
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
        setbudgets(find);
      }
    }
  };

  useEffect(() => {
    handleFindBudget();
  }, []);

  const handlAction = async () => {
    setPending(true);
    const dto = {
      source,
      method,
      amount,
      budgetId: parseInt(budgetId),
    };

    const create = await updateManagementIncomeApi(dto, income.id);

    setPending(false);

    if (
      !create.hasOwnProperty("statusCode") &&
      (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))
    ) {
      handleFindIncome();
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
                Modifier la recette
              </ModalHeader>
              <ModalBody>
                <Input
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={source === ""}
                  label="Source de la recette"
                  placeholder="Source de la recette"
                  size="md"
                  value={source}
                  variant="bordered"
                  onChange={(e) => {
                    setSource(e.target.value);
                  }}
                />
                <p className="text-sm text-default-500">
                  ex: Dîme, Offrand, Don, Événement
                </p>
                <Input
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                  isInvalid={method === ""}
                  label="Method d'acquisition"
                  placeholder="Source de la recette"
                  size="md"
                  value={method}
                  variant="bordered"
                  onChange={(e) => {
                    setMethod(e.target.value);
                  }}
                />
                <p className="text-sm text-default-500">
                  ex: Bank, Mobil Money, Cash
                </p>
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
                <Select
                  fullWidth
                  required
                  aria-label="1"
                  className="mb-2"
                  label="Ligne budgetaire"
                  placeholder="Assicier la recette à une ligne budgetaire"
                  value={budgetId}
                  onChange={(e) => {
                    setbudget(e.target.value);
                  }}
                >
                  {budgets.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      textValue={cat.budgetLine}
                      // value={cat.id}
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
