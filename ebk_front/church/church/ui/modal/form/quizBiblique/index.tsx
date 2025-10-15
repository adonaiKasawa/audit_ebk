"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Time } from "@internationalized/date";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { TimeInput } from "@heroui/date-input";

import Alert from "../../alert";

import {
  addOccurenceInQuestionApi,
  addQuestionInQuizApi,
  creatQuizBibliqueApi,
  deleteQuizApi,
  updateQuizApi,
} from "@/app/lib/actions/quizBiblique/quiz.req";
import { QuizLevelDifficulty } from "@/app/lib/config/enum";
import { ItemQuizBibliqueDetail } from "@/app/lib/config/interface";
import { timerToDateTime } from "@/app/lib/config/func";

export const quizDifficulty = [
  { key: QuizLevelDifficulty.easy, value: "Facile" },
  { key: QuizLevelDifficulty.middle, value: "Intermédiaire" },
  { key: QuizLevelDifficulty.hard, value: "Difficile" },
];
export interface IOccurence {
  occurence: string;
  isAnswer: string;
}

export function CreateQuizFormModal({
  handleFindQuizBiblique,
}: {
  handleFindQuizBiblique: () => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [type] = useState<string>("multiple_choice_close");
  const [timer, setTimer] = useState<Time | null>(new Time());
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (description && title && type && difficulty) {
      setLoading(true);
      const create = await creatQuizBibliqueApi({
        description,
        title,
        timer: timer?.toString() || "",
        difficulty,
        type,
      });

      setLoading(false);
      if (create) {
        handleFindQuizBiblique();
        setTitle("");
        setDescription("");
        setTimer(new Time());
        setDifficulty("");
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

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Créer un Quiz
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
                Créer un Quiz
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
                    label="Titre du quiz"
                    name="title"
                    placeholder="Titre du quiz"
                    type="text"
                    value={title}
                    variant="bordered"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Select
                    fullWidth
                    required
                    aria-label="1"
                    label="Sélectionner le niveau difficulté"
                    placeholder="Niveau difficulté"
                    value={difficulty}
                    variant="bordered"
                    onChange={(e) => {
                      setDifficulty(e.target.value);
                    }}
                  >
                    {quizDifficulty.map((d) => (
                      <SelectItem key={d.key} textValue={d.value}>
                        {d.value}
                      </SelectItem>
                    ))}
                  </Select>
                  <TimeInput
                    fullWidth
                    granularity="second"
                    hourCycle={24}
                    label="Temps"
                    value={timer}
                    variant="bordered"
                    onChange={(v) => {
                      setTimer(v);
                    }}
                  />
                  <Textarea
                    className="col-span-12 md:col-span-6"
                    label="Déscripition"
                    placeholder="Entrer la description"
                    value={description}
                    variant="bordered"
                    onChange={(e) => setDescription(e.target.value)}
                  />
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

export function UpdateQuizFormModal({
  handleFindQuizBiblique,
  quiz,
}: {
  handleFindQuizBiblique: () => Promise<void>;
  quiz: ItemQuizBibliqueDetail;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(quiz.description);
  const [title, setTitle] = useState<string>(quiz.title);
  const [difficulty, setDifficulty] = useState<string>(quiz.difficulty);
  const [timer, setTimer] = useState<Time | null>(
    new Time(timerToDateTime(quiz.timer).getTime()),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const route = useRouter();

  const handleSubmit = async () => {
    if (description && title && difficulty) {
      setLoading(true);
      const update = await updateQuizApi(
        { description, title, timer: timer?.toString() || "", difficulty },
        quiz.id,
      );

      setLoading(false);
      if (update) {
        handleFindQuizBiblique();
        setOpenModal(false);
      } else {
        setAlertMsg("Une erreur se produite lors de la modification du quiz.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  const handleDeleleQuizSubimt = async (id: number) => {
    setLoading(true);
    const deleteRequest = await deleteQuizApi(id);

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
      route.back();
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          className="bg-primary text-white"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Modifier le Quiz
        </Button>
        <Button
          aria-disabled={loading}
          color="danger"
          isLoading={loading}
          onClick={() => {
            handleDeleleQuizSubimt(quiz.id);
          }}
        >
          {loading ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
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
                Modification du Quiz
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
                    label="Titre du quiz"
                    name="title"
                    placeholder="Titre du quiz"
                    type="text"
                    value={title}
                    variant="bordered"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Select
                    fullWidth
                    required
                    aria-label="1"
                    label="Sélectionner le niveau difficulté"
                    placeholder="Niveau difficulté"
                    selectedKeys={new Set([difficulty])}
                    value={difficulty}
                    variant="bordered"
                    onChange={(e) => {
                      setDifficulty(e.target.value);
                    }}
                  >
                    {quizDifficulty.map((d) => (
                      <SelectItem key={d.key} textValue={d.value}>
                        {d.value}
                      </SelectItem>
                    ))}
                  </Select>
                  <TimeInput
                    fullWidth
                    granularity="second"
                    hourCycle={24}
                    label="Temps"
                    value={timer}
                    variant="bordered"
                    onChange={(v) => {
                      setTimer(v);
                    }}
                  />
                  <Textarea
                    className="col-span-12 md:col-span-6"
                    label="Déscripition"
                    placeholder="Entrer la description"
                    value={description}
                    variant="bordered"
                    onChange={(e) => setDescription(e.target.value)}
                  />
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

export function CreatAddQuestionFormModal({
  handleRefreshQuizBiblique,
  quizId,
}: {
  quizId: number;
  handleRefreshQuizBiblique: () => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [titleQuestion, setTitleQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [occurences, setOccurences] = useState<IOccurence[]>([
    { occurence: "", isAnswer: "" },
  ]);

  const validateOccurences = (
    occurences: IOccurence[],
  ): { isValid: boolean; message: string } => {
    let countIsAnswerYes = 0;

    for (const item of occurences) {
      if (item.occurence === "" || item.isAnswer === "") {
        return {
          isValid: false,
          message: "Chaque occurrence et réponse doivent être renseignées.",
        };
      }

      if (item.isAnswer === "Oui") {
        countIsAnswerYes++;
      }
    }

    if (countIsAnswerYes !== 1) {
      return {
        isValid: false,
        message: "Il doit y avoir exactement une réponse correcte.",
      };
    }

    return { isValid: true, message: "Validation réussie!" };
  };

  const handleAddOccurenceForm = () => {
    const lastIndex = occurences.length - 1;
    const lastOccurrence = occurences[lastIndex];

    if (lastOccurrence.occurence !== "" && lastOccurrence.isAnswer !== "") {
      setOccurences([...occurences, { occurence: "", isAnswer: "" }]);
    } else {
      setOpenAlert(true);
      setAlertMsg("Veillez remplir la derniere occurence correctement!");
    }
  };

  const handleResetOccurenceForm = () => {
    setOccurences([{ occurence: "", isAnswer: "" }]);
  };

  const handleSubmit = async () => {
    if (titleQuestion !== "") {
      const { isValid, message } = validateOccurences(occurences);

      if (isValid) {
        setLoading(true);
        const createQuestion = await addQuestionInQuizApi(
          { dto: [{ question: titleQuestion }] },
          quizId,
        );

        if (
          createQuestion.hasOwnProperty("statusCode") &&
          createQuestion.hasOwnProperty("message")
        ) {
          setOpenAlert(true);
          if (typeof createQuestion.message === "object") {
            let message = "";

            createQuestion.message.map(
              (item: string) => (message += `${item} \n`),
            );
            setAlertMsg(message);
          } else {
            setAlertMsg(createQuestion.message);
          }
        } else {
          const creatOccurence = await addOccurenceInQuestionApi(
            {
              dto: occurences.map((item) => ({
                occurrence: item.occurence,
                isresponse: item.isAnswer === "Oui",
              })),
            },
            createQuestion[0].id,
          );

          if (
            creatOccurence.hasOwnProperty("statusCode") &&
            creatOccurence.hasOwnProperty("message")
          ) {
            setOpenAlert(true);
            if (typeof creatOccurence.message === "object") {
              let message = "";

              creatOccurence.message.map(
                (item: string) => (message += `${item} \n`),
              );
              setAlertMsg(message);
            } else {
              setAlertMsg(creatOccurence.message);
            }
          } else {
            handleRefreshQuizBiblique();
            handleResetOccurenceForm();
            setTitleQuestion("");
            setOpenModal(false);
          }
        }
        setLoading(false);
      } else {
        setOpenAlert(true);
        setAlertMsg(message);
      }
    } else {
      setOpenAlert(true);
      setAlertMsg("Veillez remplir la question correctement!");
    }
  };

  return (
    <>
      <Button
        variant="flat"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Ajouter une question
      </Button>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        scrollBehavior="inside"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ajouter une question au quiz
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Question du quiz"
                    name="question"
                    placeholder="Question du quiz"
                    type="text"
                    value={titleQuestion}
                    variant="bordered"
                    onChange={(e) => setTitleQuestion(e.target.value)}
                  />
                  <Divider />
                  <p>Ajouter des occcurences au question</p>
                  {occurences.map((_, i) => (
                    <AddOccurenceQuiz
                      key={i}
                      index={i}
                      occurences={occurences}
                      setOccurences={setOccurences}
                    />
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-primary text-white mt-4"
                  type="button"
                  onClick={handleAddOccurenceForm}
                >
                  Ajouter une autre occurence
                </Button>
                <Button
                  className="bg-primary text-white mt-4"
                  isLoading={loading}
                  type="button"
                  onClick={handleSubmit}
                >
                  Créer
                </Button>
              </ModalFooter>
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

export function AddOccurenceQuiz({
  index,
  occurences,
  setOccurences,
}: {
  index: number;
  occurences: IOccurence[];
  setOccurences: Dispatch<SetStateAction<IOccurence[]>>;
}) {
  const handleChange = (input: "occurence" | "isAnswer", value: string) => {
    setOccurences((prev) => {
      const newOccurence = [...prev];
      const formToUpdate = { ...newOccurence[index] };

      formToUpdate[input] = value;
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
        value={occurences[index].occurence}
        variant="bordered"
        onChange={(e) => handleChange("occurence", e.target.value)}
      />
      <Select
        fullWidth
        required
        aria-label="1"
        label="Sélectionner Oui si c'est la bonne reponse"
        placeholder="La bonne reponse"
        value={occurences[index].isAnswer}
        variant="bordered"
        onChange={(e) => {
          handleChange("isAnswer", e.target.value);
        }}
      >
        {["Oui", "Non"].map((d) => (
          <SelectItem key={d} textValue={d}>
            {d}
          </SelectItem>
        ))}
      </Select>
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
