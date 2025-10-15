"use client";

import React, { useState } from "react";
import moment from "moment";
import clsx from "clsx";
import { BsCheck2Square } from "react-icons/bs";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

import {
  ItemQuizBibliqueDetail,
  OccurenceQstQuiz,
  QuestionnairesQuiz,
  ResultAnswerQuiz,
} from "@/app/lib/config/interface";
import {
  AddOccurenceQuiz,
  CreatAddQuestionFormModal,
  IOccurence,
  quizDifficulty,
  UpdateQuizFormModal,
} from "@/ui/modal/form/quizBiblique";
import {
  addOccurenceInQuestionApi,
  deleteOccurenceApi,
  deleteQuestionApi,
  findQuestionnairesByQuizIdApi,
  findQuizByIdApi,
  IOccurenceQstDto,
  updateOccurenceApi,
  updateQuestionApi,
} from "@/app/lib/actions/quizBiblique/quiz.req";
import Alert from "@/ui/modal/alert";

export default function QuizBibliqueDetailClientPage({
  params,
  initData,
}: {
  params: { id: string };
  initData: {
    questions: QuestionnairesQuiz[];
    quiz: ItemQuizBibliqueDetail;
    quizResult: ResultAnswerQuiz[];
  };
}) {
  const [quiz, setQuiz] = useState<ItemQuizBibliqueDetail>(initData.quiz);
  const [questions, setquestions] = useState<QuestionnairesQuiz[]>(
    initData.questions,
  );
  const [questionSelected, setQuestionSelect] =
    useState<QuestionnairesQuiz | null>(
      questions.length > 0 ? questions[0] : null,
    );
  const [selected, setSelected] = React.useState(
    `${questionSelected?.occurrences && questionSelected?.occurrences.length > 0 ? questionSelected?.occurrences[0].id : ""}`,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [occurences, setOccurences] = useState<IOccurence[]>([
    { occurence: "", isAnswer: "" },
  ]);
  const [onUpdating, setOnUpdating] = useState<boolean>(false);
  const [qstValue, setQstValue] = useState<string>("");
  const [viewResult, setViewResult] = useState<boolean>(false);

  const handleRefreshQuizBiblique = async () => {
    const quizFind = await findQuizByIdApi(params.id);

    if (
      !quizFind.hasOwnProperty("statusCode") &&
      !quizFind.hasOwnProperty("message")
    ) {
      setQuiz(quizFind);
    }
  };

  const handleRefreshQuestionQuizBiblique = async () => {
    setLoading(true);
    const find = await findQuestionnairesByQuizIdApi(params.id);

    setLoading(false);

    if (!find.hasOwnProperty("statusCode") && !find.hasOwnProperty("message")) {
      setquestions(find);
      if (questionSelected) {
        const qstSelected = find.find(
          (item: QuestionnairesQuiz) => item.id === questionSelected.id,
        );

        if (qstSelected) {
          setQuestionSelect(qstSelected);
          setSelected(
            qstSelected?.occurrences
              .find((item: OccurenceQstQuiz) => item.isresponse)
              ?.id.toString() || "",
          );
        } else {
          setQuestionSelect(find[0]);
          setSelected(
            find[0]?.occurrences
              .find((item: OccurenceQstQuiz) => item.isresponse)
              ?.id.toString() || "",
          );
        }
      } else {
        setQuestionSelect(find[0]);
        setSelected(
          find[0]?.occurrences
            .find((item: OccurenceQstQuiz) => item.isresponse)
            ?.id.toString() || "",
        );
      }
    }
  };

  const handleChangeQuesthion = (index: number) => {
    setQuestionSelect(questions[index]);
    handleResetOccurenceForm();
    setSelected(
      questions[index].occurrences
        .find((item) => item.isresponse)
        ?.id.toString() || "",
    );
    setQstValue(questions[index].question);
  };

  const handleChangeOccurence = async (
    data: Partial<IOccurenceQstDto>,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    response: boolean = false,
  ) => {
    setLoading(true);
    const update = await updateOccurenceApi(
      {
        occurrence: data.occurrence,
        isresponse: data.isresponse,
      },
      id,
    );

    if (
      !update.hasOwnProperty("statusCode") &&
      !update.hasOwnProperty("message")
    ) {
      if (response) {
        const trueResponse = questionSelected
          ? questionSelected.occurrences.filter(
              (item) => item.isresponse && item.id !== parseInt(id),
            )
          : [];

        for (let i = 0; i < trueResponse.length; i++) {
          const item = trueResponse[i];

          setLoading(true);
          await updateOccurenceApi(
            {
              isresponse: false,
            },
            item.id.toString(),
          );

          setLoading(false);
          handleRefreshQuestionQuizBiblique();
        }

        // if (!updateTrueResponse.hasOwnProperty("statusCode") && !updateTrueResponse.hasOwnProperty("message")) {
        //   setAlertMsg("La modification de la bonne réponse se bien passer");

        //   handleRefreshQuestionQuizBiblique()
        // } else {
        //   setOpenAlert(true);
        //   if (typeof updateTrueResponse.message === "object") {
        //     let message = "";
        //     updateTrueResponse.message.map((item: string) => (message += `${item} \n`));
        //     setAlertMsg(message);
        //   } else {
        //     setAlertMsg(updateTrueResponse.message);
        //   }
        // }
        // } else {
        //   setLoading(false);
        //   setOpenAlert(true);
        //   setAlertMsg("La modification de l'occurence se bien passer");
        //   handleRefreshQuestionQuizBiblique()
        // }
      } else {
        setLoading(false);
        setOpenAlert(true);
        setAlertMsg("La modification de l'occurence se bien passer");
        handleRefreshQuestionQuizBiblique();
      }
    } else {
      setLoading(false);
      setOpenAlert(true);
      if (typeof update.message === "object") {
        let message = "";

        update.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    }
  };

  const validateOccurences = (
    occurences: IOccurence[],
  ): { isValid: boolean; message: string } => {
    let countIsAnswerYes = 0;

    if (questionSelected) {
      const oldAndNewOccurences: IOccurence[] = [
        ...questionSelected.occurrences.map((item) => ({
          occurence: item.occurrence,
          isAnswer: item.isresponse ? "Oui" : "Non",
        })),
        ...occurences,
      ];

      for (const item of oldAndNewOccurences) {
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
    }

    return { isValid: false, message: "Vous devez sélectionner une question" };
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

  const handleAddOccerenceSubmit = async () => {
    const { isValid, message } = validateOccurences(occurences);

    if (isValid && questionSelected) {
      setLoading(true);
      const creatOccurence = await addOccurenceInQuestionApi(
        {
          dto: occurences.map((item) => ({
            occurrence: item.occurence,
            isresponse: item.isAnswer === "Oui",
          })),
        },
        questionSelected.id,
      );

      setLoading(false);

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
        handleRefreshQuestionQuizBiblique();
      }
    } else {
      setOpenAlert(true);
      setAlertMsg(message);
    }
  };

  const handleDeleleOccurenceSubimt = async (
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    const deleteRequest = await deleteOccurenceApi(id);

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
      handleRefreshQuizBiblique();
      handleResetOccurenceForm();
      handleRefreshQuestionQuizBiblique();
    }
  };

  const handleDeleleQuestionSubimt = async (id: string) => {
    setLoading(true);
    const deleteRequest = await deleteQuestionApi(id);

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
      setOnUpdating(false);
      handleRefreshQuizBiblique();
      handleResetOccurenceForm();
      handleRefreshQuestionQuizBiblique();
    }
  };

  const handleUpdateQuestionSubmit = async (id: number) => {
    setLoading(true);
    const update = await updateQuestionApi({ question: qstValue }, id);

    setLoading(false);
    if (
      update.hasOwnProperty("statusCode") &&
      update.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      if (typeof update.message === "object") {
        let message = "";

        update.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    } else {
      setOnUpdating(false);
      handleRefreshQuizBiblique();
      handleResetOccurenceForm();
      handleRefreshQuestionQuizBiblique();
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl">Quiz: {quiz.title}</h2>
        <p className="text-default-500">{quiz.description}</p>
        <div className="flex flex-col md:flex-row lg:flex-row sm:flex-col justify-between my-4 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-default-500">Temps: {quiz.timer}</p>
            <Divider orientation="vertical" />
            <p className="text-default-500">
              Difficulté:{" "}
              {quizDifficulty.find((e) => e.key === quiz.difficulty)?.value ||
                ""}
            </p>
            <Divider orientation="vertical" />
            <p className="text-default-500">
              {moment(quiz.createdAt).fromNow()}
            </p>
          </div>
          {initData.quizResult.length < 1 ? (
            <div className="flex items-center gap-4">
              <UpdateQuizFormModal
                handleFindQuizBiblique={handleRefreshQuizBiblique}
                quiz={quiz}
              />
              <CreatAddQuestionFormModal
                handleRefreshQuizBiblique={handleRefreshQuestionQuizBiblique}
                quizId={quiz.id}
              />
            </div>
          ) : (
            <Button
              variant="flat"
              onClick={() => {
                setViewResult(!viewResult);
              }}
            >
              Voir le résutat
            </Button>
          )}
        </div>
        <Divider />
      </div>
      {!viewResult ? (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <Card>
              <CardHeader className="text-2xl font-bold">
                Questionnaires
              </CardHeader>
              <Divider className="bg-default" />
              <div>
                {questions && questions.length > 0 ? (
                  questions.map((item, i) => (
                    <div
                      key={i}
                      className={clsx("py-4 border-b cursor-pointer", {
                        "bg-default-200":
                          questionSelected && item.id === questionSelected.id,
                      })}
                    >
                      <button
                        className="px-2"
                        onClick={() => {
                          handleChangeQuesthion(i);
                        }}
                      >
                        {item.question}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="my-4 text-center text-default-400">
                    Aucunne question pour le moment!
                  </p>
                )}
              </div>
            </Card>
          </div>
          <div className="col-span-2">
            <Card>
              <CardHeader className="text-2xl font-bold">
                Qeustion & Occurrences
              </CardHeader>
              <CardBody>
                {questionSelected && (
                  <>
                    <div>
                      {onUpdating ? (
                        <form
                          className="flex w-full"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateQuestionSubmit(questionSelected.id);
                          }}
                        >
                          <Input
                            fullWidth
                            isDisabled={loading}
                            label="Modifier la question"
                            name="question"
                            placeholder="Question"
                            type="text"
                            value={qstValue}
                            variant="bordered"
                            onChange={(e) => setQstValue(e.target.value)}
                          />
                        </form>
                      ) : (
                        <p>Qst: {questionSelected.question}</p>
                      )}
                      {initData.quizResult.length < 1 && (
                        <div className="flex justify-end gap-4 my-4">
                          <Button
                            aria-disabled={loading}
                            color="danger"
                            isLoading={loading}
                            size="sm"
                            variant="bordered"
                            onClick={() => {
                              handleDeleleQuestionSubimt(
                                questionSelected.id.toString(),
                              );
                            }}
                          >
                            {loading ? "Suppression ..." : "Supprimer"}
                          </Button>
                          <Button
                            aria-disabled={loading}
                            color="warning"
                            isDisabled={loading}
                            isLoading={loading}
                            size="sm"
                            variant="bordered"
                            onClick={() => {
                              setOnUpdating(!onUpdating);
                            }}
                          >
                            {loading ? "Modification" : "Modifier"}
                          </Button>
                        </div>
                      )}
                    </div>
                    <Divider />
                    <p className="text-xl text-center">Occurrences</p>
                    {questionSelected.occurrences !== undefined &&
                    questionSelected.occurrences.length > 0 ? (
                      questionSelected?.occurrences.map((item, i) => (
                        <UpdateOrDeleteOccurence
                          key={i}
                          handleChangeOccurence={handleChangeOccurence}
                          handleDeleleOccurenceSubimt={
                            handleDeleleOccurenceSubimt
                          }
                          index={i}
                          isAnswered={initData.quizResult.length < 1}
                          occurence={item}
                        />
                      ))
                    ) : (
                      <p className="my-8 text-2xl text-center text-default-400">
                        Aucune occurrences trouver !
                      </p>
                    )}

                    {initData.quizResult.length < 1 &&
                      questionSelected.occurrences !== undefined &&
                      questionSelected.occurrences.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <Select
                            fullWidth
                            aria-label="1"
                            className="mt-4"
                            label="Sélectionner la bonne réponse"
                            placeholder="La bonne reponse"
                            selectedKeys={new Set([selected])}
                            value={selected}
                            variant="bordered"
                            onChange={(e) => {
                              setSelected(e.target.value);
                            }}
                          >
                            {questionSelected.occurrences.map((item) => (
                              <SelectItem
                                key={item.id}
                                textValue={item.occurrence}
                                // value={item.id}
                              >
                                {item.occurrence}
                              </SelectItem>
                            ))}
                          </Select>
                          <Button
                            className=""
                            isLoading={loading}
                            onClick={() => {
                              let occurence = questionSelected.occurrences.find(
                                (item) => item.id === parseInt(selected),
                              );

                              if (occurence) {
                                handleChangeOccurence(
                                  {
                                    occurrence: occurence.occurrence,
                                    isresponse: true,
                                  },
                                  selected,
                                  setLoading,
                                  true,
                                );
                              }
                            }}
                          >
                            <p> Changer la bonne réponse</p>
                          </Button>
                        </div>
                      )}
                    {initData.quizResult.length < 1 && (
                      <div className="flex flex-col gap-4">
                        <p className="mt-4 text-xl text-center">
                          Ajouter des occurrences à la question
                        </p>
                        {occurences.map((_, i) => (
                          <AddOccurenceQuiz
                            key={i}
                            index={i}
                            occurences={occurences}
                            setOccurences={setOccurences}
                          />
                        ))}
                        <div className="flex justify-end gap-4">
                          <Button
                            className="bg-primary text-white mt-4"
                            type="button"
                            onClick={handleAddOccurenceForm}
                          >
                            Ajouter une autre occurrences
                          </Button>
                          <Button
                            className="bg-primary text-white mt-4"
                            isLoading={loading}
                            type="button"
                            onClick={handleAddOccerenceSubmit}
                          >
                            Enregistré
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex  mx-16 mt-4">
          <ResultClassementAnswerQuizComponent
            quizResult={initData.quizResult}
          />
        </div>
      )}
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={"Message"}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </div>
  );
}

export const UpdateOrDeleteOccurence = ({
  occurence,
  index,
  handleChangeOccurence,
  handleDeleleOccurenceSubimt,
  isAnswered,
}: {
  occurence: OccurenceQstQuiz;
  index: number;
  handleChangeOccurence: (
    data: Partial<IOccurenceQstDto>,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    response?: boolean,
  ) => Promise<void>;
  handleDeleleOccurenceSubimt: (
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
  isAnswered: boolean;
}) => {
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
                occurence.id.toString(),
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
            {`)`} {occurence.occurrence} {occurence.id}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        {occurence.isresponse && (
          <Button isIconOnly color="success" size="sm" variant="light">
            <BsCheck2Square size={25} />
          </Button>
        )}
        {isAnswered && (
          <Button
            aria-disabled={deletedLoading}
            color="danger"
            isLoading={deletedLoading}
            size="sm"
            variant="bordered"
            onClick={() => {
              handleDeleleOccurenceSubimt(
                occurence.id.toString(),
                setDeletedLoading,
              );
            }}
          >
            {deletedLoading ? "Suppression ..." : "Supprimer"}
          </Button>
        )}
        {isAnswered && (
          <Button
            aria-disabled={loading}
            color="warning"
            isDisabled={loading}
            isLoading={loading}
            size="sm"
            variant="bordered"
            onClick={() => {
              setOnUpdating(!onUpdating);
            }}
          >
            {loading ? "Modification" : "Modifier"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const ResultClassementAnswerQuizComponent = ({
  quizResult,
}: {
  quizResult: ResultAnswerQuiz[];
}) => {
  return (
    <Table fullWidth isStriped aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>#</TableColumn>
        <TableColumn>Fidel</TableColumn>
        <TableColumn>Reponse correct</TableColumn>
        <TableColumn>Total de réponse</TableColumn>
        <TableColumn>Temps Total</TableColumn>
        <TableColumn>Total de Moyene</TableColumn>
      </TableHeader>
      <TableBody>
        {quizResult.map((item, i) => {
          return (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                {item.user.nom} {item.user.prenom}
              </TableCell>
              <TableCell>{item.correct}</TableCell>
              <TableCell>{item.total}</TableCell>
              <TableCell>{item.totalTime}s</TableCell>
              <TableCell>{item.avgTime.toFixed(2)}s</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
