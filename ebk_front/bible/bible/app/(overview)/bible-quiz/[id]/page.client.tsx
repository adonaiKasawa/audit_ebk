"use client";

import clsx from "clsx";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { Image } from "@heroui/image";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

import {
  ItemQuizBiblique,
  QuestionnairesQuiz,
  ResponseQuiz,
  ResultAnswerQuiz,
} from "@/app/lib/config/interface";
import {
  getRandomNumberBetween,
  secondsToTime,
  timeToSeconds,
} from "@/app/lib/config/func";
import {
  createQuizAnswerApi,
  CreateQuizAnswerDto,
} from "@/app/lib/actions/quizBiblique/quiz.req";

const img = getRandomNumberBetween(1, 6);

export default function BibleQuizPageClientById({
  initData,
}: {
  session: Session | null;
  initData: {
    quiz: ItemQuizBiblique;
    questions: QuestionnairesQuiz[];
    alreadyAnswered: ResponseQuiz[];
    quizResult: ResultAnswerQuiz[];
  };
}) {
  const [quiz] = useState<ItemQuizBiblique>(initData.quiz);
  const [questions] = useState<QuestionnairesQuiz[]>(initData.questions);
  const [isActive, setIsActive] = useState<number>(0);
  const [, setLoading] = useState<boolean>(false);
  const [inTime, setInTime] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(0);
  const [answer, setAnswer] = useState<CreateQuizAnswerDto[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const limitTime = timeToSeconds(quiz.timer);
  const [sugestion, setSugestion] = useState<string>("");
  const timerRef = useRef<number>(timer);
  const answerRef = useRef<CreateQuizAnswerDto[]>(answer);
  const inTimeRef = useRef<boolean>(inTime);
  const isAlreadyAnswered = initData.alreadyAnswered.length > 0;

  inTimeRef.current = inTime;
  answerRef.current = answer;

  const router = useRouter();

  // const handleSendSuggestion = async () => {
  //   await createSuggestion()
  // };

  const navigateToNextQuestion = () => {
    setIsAnswered(false);
    setIsActive((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
    if (answerRef.current.length === questions.length) {
      handelUserAnswerQuizSubmit();
    }
  };

  const handelUserAnswerQuiz = async (
    responseId: number,
    questionId: number,
  ) => {
    setAnswer((prev) => [
      ...prev,
      { response: responseId.toString(), timer: timer.toString(), questionId },
    ]);
    setIsAnswered(true);
    setTimeout(() => {
      navigateToNextQuestion();
    }, 1000);
  };

  const handelUserAnswerQuizSubmit = useCallback(async () => {
    setLoading(true);
    await createQuizAnswerApi({ dto: answerRef.current });
    setLoading(false);
    router.back();
  }, [router]);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      if (timerRef.current === limitTime) {
        clearInterval(intervalRef);
        setInTime(false);
        handelUserAnswerQuizSubmit();

        return;
      }

      if (answerRef.current.length === questions.length) {
        clearInterval(intervalRef);

        return;
      }

      if (isAlreadyAnswered) {
        clearInterval(intervalRef);

        return;
      }

      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalRef);
  }, [limitTime, isAlreadyAnswered, handelUserAnswerQuizSubmit, questions]);

  return (
    <div>
      <div>
        <p className="text-2xl">{quiz.title}</p>
        <p>{quiz.description}</p>
        <p>Question: {questions.length}</p>
      </div>
      <div className="flex flex-col mx-16 justify-center items-center h-max">
        {!isAlreadyAnswered ? (
          <>
            {[questions[isActive]].map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-center items-center"
                >
                  <Image
                    alt={`quizImg${img}.jpg`}
                    height={300}
                    src={`/QuizImg/quizImg${img}.jpg`}
                    width={300}
                  />
                  <p className="text-xl my-8">{item.question}</p>
                  <div className="flex w-full gap-4 items-center justify-center">
                    <p>{secondsToTime(timer)}</p>
                    <Progress
                      aria-label="Loading..."
                      color="warning"
                      size="sm"
                      value={(timer / limitTime) * 100}
                    />
                    <p>{quiz.timer}</p>
                  </div>
                  <div className="flex flex-col w-full">
                    {inTime && answerRef.current.length < questions.length && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          {item.occurrences.map((r) => {
                            return (
                              <div key={`occurence-${r.id}`} className="w-full">
                                <Card
                                  fullWidth
                                  isPressable
                                  className={
                                    isAnswered
                                      ? clsx("border-2 border-danger", {
                                          "border-success": r.isresponse,
                                        })
                                      : ""
                                  }
                                  isDisabled={!inTime}
                                  onClick={() => {
                                    handelUserAnswerQuiz(r.id, item.id);
                                  }}
                                >
                                  <CardBody>
                                    <p className="text-center">
                                      {r.occurrence}
                                    </p>
                                    {isAnswered &&
                                      answer[isActive].response ===
                                        r.id.toString() && (
                                        <>
                                          {r.isresponse ? (
                                            <div className="w-full h-2 border-2 bg-success rounded-md border-success" />
                                          ) : (
                                            <div className="w-full h-2 border-2 rounded-md bg-danger border-danger" />
                                          )}
                                        </>
                                      )}
                                  </CardBody>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-neutral-200 mt-4 text-center">
                          Cliquez sur la bonne réponse!
                        </p>
                      </>
                    )}
                    {!inTime && (
                      <div className="flex mt-6 justify-center items-center">
                        <p>Vous avez dépassé la limite de temps autorisée.</p>
                      </div>
                    )}
                    {answerRef.current.length === questions.length && (
                      <div>
                        <p>
                          Merci d&lsquo;avoir participé au quiz biblique ! Vos
                          retours nous seront précieux pour améliorer cette
                          fonctionnalité. Comment pouvons-nous la rendre encore
                          plus intéressante pour vous ?
                        </p>
                        <Textarea
                          className="col-span-12 md:col-span-6 mt-4"
                          label="Déscripition"
                          placeholder="Entrer la description"
                          value={sugestion}
                          variant="bordered"
                          onChange={(e) => setSugestion(e.target.value)}
                        />
                        <Button
                          className="mt-4"
                          color="primary"
                          onClick={() => {}}
                        >
                          <p className="text-white">Envoyer</p>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <div className="mt-16 w-full border border-default-300 rounded-lg p-12">
              <p className="text-xl">
                Vous avez déjà participé à ce quiz biblique. Nous vous
                remercions de votre intérêt.
              </p>
            </div>
            <div className="mt-4">
              <p className="text-center text-xl underline">Résultat</p>
              {initData.alreadyAnswered.map((item, i) => {
                const yourAnswer = item.question?.occurrences.find(
                  (o) =>
                    o.id.toString() === item.question?.responses[0].response,
                );

                return (
                  <div key={i} className="mt-4">
                    <p>
                      {i + 1}
                      {`)`} {item.question?.question}
                    </p>
                    {item.question?.occurrences.map((occurence) => {
                      return (
                        <div
                          key={occurence.id}
                          className="ml-8 mt-2 flex gap-4 items-center"
                        >
                          {occurence.isresponse ? (
                            <GiCheckMark className="text-success text-xl" />
                          ) : (
                            <p>-</p>
                          )}
                          <p>{occurence.occurrence} </p>
                        </div>
                      );
                    })}
                    <div className="border border-default-300 rounded-lg p-4 mt-4">
                      <p>Votre Réponse</p>
                      {yourAnswer && (
                        <div className="flex gap-4">
                          <p> {yourAnswer.occurrence}</p>
                          {yourAnswer.isresponse ? (
                            <GiCheckMark className="text-success text-xl" />
                          ) : (
                            <RxCross1 className="text-danger text-xl" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="my-8">
                <ResultClassementAnswerQuizComponent
                  quizResult={initData.quizResult}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
