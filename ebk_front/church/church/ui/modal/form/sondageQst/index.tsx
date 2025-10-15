"use client";

import { CiEdit, CiMedicalCross, CiTrash } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { useState, Dispatch, SetStateAction } from "react";
import { Image } from "@heroui/image";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { RadioGroup, Radio } from "@heroui/radio";

import Alert from "../../alert";

import {
  createSondageQstApi,
  createSondageQuestionApi,
  CreateSQOccurenceDto,
  deleteSondageQstApi,
  updateSondageQstApi,
} from "@/app/lib/actions/sondageQst/sondageQst.req";
import { SondageQuestionTypeEnum } from "@/app/lib/config/enum";
import { ItemSondageQst, OccurenceSondage } from "@/app/lib/config/interface";
import { cn } from "@/lib/utils";

export const sondageQuestionType = [
  { key: SondageQuestionTypeEnum.LADDER, value: "Échelle" },
  { key: SondageQuestionTypeEnum.TRICOLOR, value: "Tricolore" },
  {
    key: SondageQuestionTypeEnum.MCO,
    value: "Choix multiple avec réponse ouverte",
  },
  {
    key: SondageQuestionTypeEnum.MCC,
    value: "Choix multiple avec réponses fermées",
  },
  {
    key: SondageQuestionTypeEnum.MCOT,
    value: "Choix multiple avec autre option",
  },
];

export function CreateSondageQstFormModal({
  handleFindSondageQst,
}: {
  handleFindSondageQst: () => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [objectif, setObjectif] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (title) {
      setLoading(true);
      const create = await createSondageQstApi({
        objectif,
        title,
        public: isPublic,
      });

      setLoading(false);
      if (
        !create.hasOwnProperty("statusCode") &&
        !create.hasOwnProperty("message")
      ) {
        handleFindSondageQst();
        setTitle("");
        setObjectif("");
        setIsPublic(true);
        setOpenModal(false);
      } else {
        setAlertMsg("Une erreur se produite lors de la création du sondage.");
        setOpenAlert(true);
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
        Créer un sondage
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
                Création du sondage
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Input
                    label="Titre"
                    name="title"
                    placeholder="Titre"
                    type="text"
                    value={title}
                    variant="bordered"
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <Textarea
                    className="col-span-12 md:col-span-6"
                    label="Fixer un objectif"
                    placeholder="Entrer l'objectif"
                    value={objectif}
                    variant="bordered"
                    onChange={(e) => setObjectif(e.target.value)}
                  />
                  <Switch
                    classNames={{
                      base: cn(
                        "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                        "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary",
                      ),
                      wrapper: "p-0 h-4 overflow-visible",
                      thumb: cn(
                        "w-6 h-6 border-2 shadow-lg",
                        "group-data-[hover=true]:border-primary",
                        //selected
                        "group-data-[selected=true]:ml-6",
                        // pressed
                        "group-data-[pressed=true]:w-7",
                        "group-data-[selected]:group-data-[pressed]:ml-4",
                      ),
                    }}
                    isSelected={isPublic}
                    onValueChange={setIsPublic}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-medium">Public</p>
                      <p className="text-tiny text-default-400">
                        Si vous desactiver la valeur public, seule les membres
                        de votre église verrons ce sondage
                      </p>
                    </div>
                  </Switch>
                  <div className="flex justify-end">
                    <Button
                      className="bg-primary text-white mt-4"
                      isLoading={loading}
                      type="submit"
                    >
                      Créer
                    </Button>
                  </div>
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

export function AddQeustionInSondageFormModal({
  handleFindSondageQst,
  sondageId,
}: {
  handleFindSondageQst: () => Promise<void>;
  sondageId: number;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [typeQst, setTypeQst] = useState<SondageQuestionTypeEnum>(
    SondageQuestionTypeEnum.TRICOLOR,
  );
  const [titleQst, setTitleQst] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handelCreateSondageQuestion = async () => {
    if (typeQst) {
      setLoading(true);
      const create = await createSondageQuestionApi(
        { type: typeQst, question: titleQst },
        sondageId,
      );

      setLoading(false);
      if (
        !create.hasOwnProperty("statusCode") &&
        !create.hasOwnProperty("message")
      ) {
        handleFindSondageQst();
        setTypeQst(SondageQuestionTypeEnum.TRICOLOR);
        setTitleQst("");
        setOpenModal(false);
      } else {
        setAlertMsg("Une erreur se produite lors de la création du quiz.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  const renderTypeqQuestion = () => {
    switch (typeQst) {
      case SondageQuestionTypeEnum.LADDER:
        return (
          <div className="flex gap-2">
            {[
              Array.from({ length: 5 }).map((_, i) => {
                i++;

                return (
                  <>
                    <Image
                      key={i}
                      height={50}
                      src={`/icon/imoji${i}.png`}
                      width={50}
                    />
                  </>
                );
              }),
            ]}
          </div>
        );
      case SondageQuestionTypeEnum.TRICOLOR:
        return (
          <div className="flex gap-2">
            {["1", "3", "5"].map((i) => {
              return (
                <>
                  <Image height={50} src={`/icon/imoji${i}.png`} width={50} />
                </>
              );
            })}
          </div>
        );
      case SondageQuestionTypeEnum.MCC:
        return (
          <div>
            <p>Le participant ne pourra choisir qu&apos;une seule réponse.</p>
            <p>Q:Quelle est votre ville préférée ?</p>
            <RadioGroup
              defaultValue="london"
              label="Sélectionnez votre ville préférée"
            >
              <Radio value="buenos-aires">Buenos Aires</Radio>
              <Radio value="sydney">Sydney</Radio>
              <Radio value="san-francisco">San Francisco</Radio>
              <Radio value="london">London</Radio>
              <Radio value="tokyo">Tokyo</Radio>
            </RadioGroup>
          </div>
        );
      case SondageQuestionTypeEnum.MCO:
        return (
          <div>
            <CheckboxGroup
              defaultValue={["buenos-aires", "london"]}
              label="Sélectionnez les villes"
            >
              <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
              <Checkbox value="sydney">Sydney</Checkbox>
              <Checkbox value="san-francisco">San Francisco</Checkbox>
              <Checkbox value="london">London</Checkbox>
              <Checkbox value="tokyo">Tokyo</Checkbox>
            </CheckboxGroup>
          </div>
        );
      case SondageQuestionTypeEnum.MCOT:
        return (
          <div>
            <Input
              label="Entrer votre réponse"
              name="respone"
              placeholder="Entrer votre réponse"
              type="text"
              variant="bordered"
            />
          </div>
        );
      default:
        break;
    }
  };

  return (
    <>
      <Button
        isIconOnly
        color="success"
        size="sm"
        title="Ajouter une question au sondage"
        variant="bordered"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <CiMedicalCross size={24} />
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
                Ajouter une question au sondage
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handelCreateSondageQuestion();
                  }}
                >
                  <Input
                    label="Question"
                    name="title"
                    placeholder="Entrer votre question"
                    type="text"
                    value={titleQst}
                    variant="bordered"
                    onChange={(e) => setTitleQst(e.target.value)}
                  />
                  <Select
                    fullWidth
                    required
                    aria-label="1"
                    label="Sélectionner le type de la question"
                    placeholder="Type de la question"
                    selectedKeys={new Set([typeQst])}
                    value={typeQst}
                    variant="bordered"
                    onChange={(e) => {
                      const f = sondageQuestionType.find(
                        (item) => item.key === e.target.value,
                      );

                      if (f) {
                        setTypeQst(f.key);
                      }
                    }}
                  >
                    {sondageQuestionType.map((d) => (
                      <SelectItem key={d.key} textValue={d.value}>
                        {d.value}
                      </SelectItem>
                    ))}
                  </Select>
                  <Divider />
                  <p>Aperçu du type</p>
                  {renderTypeqQuestion()}
                  <div className="flex justify-end">
                    <Button
                      className="bg-primary text-white mt-4"
                      isLoading={loading}
                      type="submit"
                    >
                      Créer
                    </Button>
                  </div>
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

export function AddOccurenceSondageQst({
  index,
  occurences,
  setOccurences,
}: {
  index: number;
  occurences: CreateSQOccurenceDto[];
  setOccurences: Dispatch<SetStateAction<CreateSQOccurenceDto[]>>;
}) {
  const handleChange = (value: string) => {
    setOccurences((prev) => {
      const newOccurence = [...prev];
      const formToUpdate = { ...newOccurence[index] };

      formToUpdate.occurrence = value;
      newOccurence[index] = formToUpdate;

      return newOccurence;
    });
  };

  const removeOccurence = () => {
    setOccurences((prev) => {
      const newOccurence = prev.filter((_, i) => i !== index);

      return newOccurence;
    });
  };

  return (
    <>
      <Input
        label="Occurence de la question"
        name="question"
        placeholder="Occurence de la question"
        type="text"
        value={occurences[index].occurrence}
        variant="bordered"
        onChange={(e) => handleChange(e.target.value)}
      />
      {occurences.length > 1 && (
        <div className="flex justify-end">
          <Button
            color="danger"
            size="sm"
            variant="bordered"
            onClick={removeOccurence}
          >
            Supprimer
          </Button>
        </div>
      )}
    </>
  );
}

export function UpdateOrDeleteOccurenceSondageQst({
  occurence,
  index,
  handleChangeOccurence,
  handleDeleleOccurenceSubimt,
}: {
  occurence: OccurenceSondage;
  index: number;
  handleChangeOccurence: (
    data: CreateSQOccurenceDto,
    id: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
  handleDeleleOccurenceSubimt: (
    id: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
}) {
  const [onUpdating, setOnUpdating] = useState<boolean>(false);
  const [occurenceValue, setOccurenceValue] = useState<string>(
    occurence.occurrence,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [deletedLoading, setDeletedLoading] = useState<boolean>(false);

  return (
    <div className="flex w-full items-center py-4 border-b gap-4">
      <div className="flex w-full">
        {onUpdating ? (
          <form
            className="flex w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleChangeOccurence(
                { occurrence: occurenceValue },
                occurence.id,
                setLoading,
              );
            }}
          >
            <Input
              fullWidth
              isDisabled={loading}
              label="Occurence de la question"
              name="occurence"
              placeholder="Occurence de la question"
              type="text"
              value={occurenceValue}
              variant="bordered"
              onChange={(e) => setOccurenceValue(e.target.value)}
            />
          </form>
        ) : (
          <p className="text-xl text-left line-clamp-3">
            {index + 1}
            {`)`} {occurence.occurrence}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        {/* {occurence.isresponse && <Button isIconOnly variant="light" color="success" size="sm"><BsCheck2Square size={25} /></Button>} */}
        {/* <Button isLoading={deletedLoading} aria-disabled={deletedLoading} variant="bordered" color="danger" size="sm" onClick={() => { 
         }}>
        {deletedLoading ? "Suppression ..." : "Supprimer"}
      </Button>
      <Button isLoading={loading} aria-disabled={loading} isDisabled={loading} onClick={() => { setOnUpdating(!onUpdating) }} variant="bordered" color="warning" size="sm">
        {loading ? "Modification" : "Modifier"}
      </Button> */}
        <Button
          isIconOnly
          aria-disabled={loading}
          color="warning"
          isDisabled={loading}
          isLoading={loading}
          size="sm"
          title="Modifier la question"
          variant="bordered"
          onClick={() => {
            setOnUpdating(!onUpdating);
          }}
        >
          <CiEdit size={24} />
        </Button>
        <Button
          isIconOnly
          aria-disabled={deletedLoading}
          isLoading={deletedLoading}
          size="sm"
          title="Supprimer la question"
          variant="bordered"
          onClick={() => {
            handleDeleleOccurenceSubimt(occurence.id, setDeletedLoading);
          }}
        >
          <CiTrash size={24} />
        </Button>
      </div>
    </div>
  );
}

export function UpdateOrDeleteSondageQst({
  sondage,
  handleFindSondageQst,
}: {
  sondage: ItemSondageQst;
  handleFindSondageQst: () => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [title, setTitle] = useState<string>(sondage.title);
  const [objectif, setObjectif] = useState<string>(sondage.objectif);
  const [isPublic, setIsPublic] = useState<boolean>(sondage.public);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async () => {
    if (title) {
      setLoading(true);
      const create = await updateSondageQstApi(
        { objectif, title, public: isPublic },
        sondage.id,
      );

      setLoading(false);
      if (
        !create.hasOwnProperty("statusCode") &&
        !create.hasOwnProperty("message")
      ) {
        handleFindSondageQst();
        setOpenModal(false);
      } else {
        setAlertMsg(
          "Une erreur se produite lors de la modification du sondage.",
        );
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  const handleDeleleSubimt = async () => {
    setLoading(true);
    const deleteRequest = await deleteSondageQstApi(sondage.id);

    setLoading(false);
    if (
      deleteRequest.hasOwnProperty("statusCode") &&
      deleteRequest.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      if (typeof deleteRequest.message === "object") {
        let message = "";

        deleteRequest.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(deleteRequest.message);
      }
    } else {
      router.back();
    }
  };

  return (
    <>
      <Button
        isIconOnly
        aria-disabled={loading}
        color="warning"
        isDisabled={loading}
        isLoading={loading}
        size="sm"
        title="Modifier la question"
        variant="bordered"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <CiEdit size={24} />
      </Button>
      <Button
        isIconOnly
        aria-disabled={loading}
        isDisabled={loading}
        isLoading={loading}
        size="sm"
        title="Supprimer le sondage"
        variant="bordered"
        onClick={handleDeleleSubimt}
      >
        <CiTrash size={24} />
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
                Création du sondage
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Input
                    label="Titre"
                    name="title"
                    placeholder="Titre"
                    type="text"
                    value={title}
                    variant="bordered"
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <Textarea
                    className="col-span-12 md:col-span-6"
                    label="Fixer un objectif"
                    placeholder="Entrer l'objectif"
                    value={objectif}
                    variant="bordered"
                    onChange={(e) => setObjectif(e.target.value)}
                  />
                  <Switch
                    classNames={{
                      base: cn(
                        "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                        "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary",
                      ),
                      wrapper: "p-0 h-4 overflow-visible",
                      thumb: cn(
                        "w-6 h-6 border-2 shadow-lg",
                        "group-data-[hover=true]:border-primary",
                        //selected
                        "group-data-[selected=true]:ml-6",
                        // pressed
                        "group-data-[pressed=true]:w-7",
                        "group-data-[selected]:group-data-[pressed]:ml-4",
                      ),
                    }}
                    isSelected={isPublic}
                    onValueChange={setIsPublic}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-medium">Public</p>
                      <p className="text-tiny text-default-400">
                        Si vous desactiver la valeur public, seule les membres
                        de votre église verrons ce sondage
                      </p>
                    </div>
                  </Switch>
                  <div className="flex justify-end">
                    <Button
                      className="bg-primary text-white mt-4"
                      isLoading={loading}
                      type="submit"
                    >
                      Modifier
                    </Button>
                  </div>
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
