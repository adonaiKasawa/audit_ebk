"use client";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import Link from "next/link";
import { Radio, RadioGroup } from "@heroui/radio";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";

import {
  ItemSondageQstDetail,
  QuestionnairesSondage,
} from "@/app/lib/config/interface";
import Alert from "@/ui/modal/alert";
import {
  createAnswerApi,
  CreateSQAnswerDto,
  findAllAnswerBySurveyIdAndUserIdApi,
  findCheckIfUserAnswerSondageApi,
} from "@/app/lib/actions/sondageQst/sondageQst.req";
import { SondageQuestionTypeEnum } from "@/app/lib/config/enum";

export default function SondageQstByIdPageClient({
  session,
  initData,
  params,
}: {
  session: Session | null;
  initData: { sondage: ItemSondageQstDetail };
  params: { id: string };
}) {
  const user = session?.user;
  const sondageId = parseInt(params.id);
  const [sondageQst] = useState<ItemSondageQstDetail>(initData.sondage);
  const [questionInSondage] = useState<QuestionnairesSondage[]>(
    sondageQst.questions,
  );

  // const [questionSelected, setQuestionSelect] = useState<QuestionnairesSondage>(
  //   questionInSondage[0],
  // );
  const [responses, setResponses] = useState<CreateSQAnswerDto[]>([]);

  const [checkIfUserAnswered, setCheckIfUserAnswered] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const router = useRouter();

  const handelFindAllAnswerBySurveyIdAndUserId = useCallback(async () => {
    if (user) {
      const sondage = await findAllAnswerBySurveyIdAndUserIdApi(
        user.sub,
        sondageId,
      );

      if (
        !sondage.hasOwnProperty("statusCode") &&
        !sondage.hasOwnProperty("message")
      ) {
        const response = sondage.map((item: any) => ({
          response: item.response,
          id_qeustion: item.question.id,
        }));

        setResponses(response);
      }
    }
  }, [user, sondageId]);

  const handleFindCheckIfUserAnswerSondage = useCallback(async () => {
    const sondage = await findCheckIfUserAnswerSondageApi(sondageId);

    if (
      !sondage.hasOwnProperty("statusCode") &&
      !sondage.hasOwnProperty("message")
    ) {
      setCheckIfUserAnswered(sondage);
    }
  }, [sondageId]);

  const renderTypeqQuestion = (question: QuestionnairesSondage) => {
    const res = responses.find((item) => item.id_qeustion === question.id);

    switch (question.type) {
      case SondageQuestionTypeEnum.LADDER:
        return (
          <div className="flex gap-2 ml-4">
            {[
              Array.from({ length: 5 }).map((_, i) => {
                i++;

                return (
                  <Button
                    key={i}
                    isIconOnly
                    color="primary"
                    isDisabled={checkIfUserAnswered}
                    variant={
                      res && res.response === `${i}` ? "bordered" : "light"
                    }
                    onClick={() => handleResponseChange(question.id, `${i}`)}
                  >
                    <Image
                      alt={`/icon/imoji${i}.png`}
                      height={40}
                      src={`/icon/imoji${i}.png`}
                      width={40}
                    />
                  </Button>
                );
              }),
            ]}
          </div>
        );
      case SondageQuestionTypeEnum.TRICOLOR:
        return (
          <div className="flex gap-2 ml-4">
            {["1", "3", "5"].map((i) => {
              return (
                <Button
                  key={i}
                  isIconOnly
                  color="primary"
                  isDisabled={checkIfUserAnswered}
                  variant={
                    res && res.response === `${i}` ? "bordered" : "light"
                  }
                  onClick={() => handleResponseChange(question.id, `${i}`)}
                >
                  <Image
                    alt={`/icon/imoji${i}.png`}
                    height={40}
                    src={`/icon/imoji${i}.png`}
                    width={40}
                  />
                </Button>
              );
            })}
          </div>
        );
      case SondageQuestionTypeEnum.MCC:
        return (
          <div className="ml-4">
            <RadioGroup
              isDisabled={checkIfUserAnswered}
              label="Sélectionnez une seule réponse"
              value={res ? res.response : undefined}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            >
              {question.occurrences.map((item) => (
                <Radio key={item.id} value={`${item.id}`}>
                  {item.occurrence}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        );
      case SondageQuestionTypeEnum.MCO:
        return (
          <div className="ml-4">
            <CheckboxGroup
              isDisabled={checkIfUserAnswered}
              label="Sélectionnez une ou plusieur réponse"
              value={res ? res.response.split(",") : undefined}
              onChange={(e) => handleResponseChange(question.id, e.join(","))}
            >
              {question.occurrences.map((item) => (
                <Checkbox key={item.id} value={`${item.id}`}>
                  {item.occurrence}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        );
      case SondageQuestionTypeEnum.MCOT:
        return (
          <div>
            <Input
              isDisabled={checkIfUserAnswered}
              label="Entrer votre réponse"
              name="respone"
              placeholder="Entrer votre réponse"
              type="text"
              variant="bordered"
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          </div>
        );
      default:
        break;
    }
  };

  const hasUserAnsweredAllQuestions = (): boolean => {
    const questionIds = questionInSondage.map((question) => question.id);

    const allAnswered = questionIds.every((questionId) => {
      return responses.some(
        (response) =>
          response.id_qeustion === questionId && response.response !== "",
      );
    });

    return allAnswered;
  };

  const handleResponseChange = (id_qeustion: number, response: string) => {
    setResponses((prev) => {
      const existingResponse = prev.find(
        (res) => res.id_qeustion === id_qeustion,
      );

      if (existingResponse) {
        return prev.map((res) =>
          res.id_qeustion === id_qeustion ? { ...res, response } : res,
        );
      } else {
        return [...prev, { id_qeustion, response }];
      }
    });
  };

  const handelSubmitSondage = async () => {
    if (!hasUserAnsweredAllQuestions()) {
      setAlertMsg(
        "Veuillez répondre à toutes les questions avant de soumettre.",
      );
      setOpenAlert(true);

      return;
    }

    setLoading(true);
    const create = await createAnswerApi({ dto: responses });

    setLoading(false);

    if (
      create.hasOwnProperty("statusCode") &&
      create.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof create.message === "object") {
        let message = "";

        create.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    } else {
      router.push(`/sondage`);
    }
  };

  useEffect(() => {
    handleFindCheckIfUserAnswerSondage();
    handelFindAllAnswerBySurveyIdAndUserId();
  }, [
    handleFindCheckIfUserAnswerSondage,
    handelFindAllAnswerBySurveyIdAndUserId,
  ]);

  return (
    <div>
      {sondageQst && (
        <div className="flex flex-col">
          <div className="border-b py-2">
            <p className="text-2xl">{sondageQst.title}</p>
            <p className="text-default-500">{sondageQst.objectif}</p>
            <div className="flex justify-between items-center py-2">
              <p className="text-default-500">
                Visibilité: {sondageQst.public ? "public" : "privé"}
              </p>
              <p className="text-default-500">
                Nombre de question: {questionInSondage.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-4 mt-4">
            <div className="col-span-8 md:col-start-2 md:col-span-6">
              <Card>
                <CardHeader className="text-2xl">Questions</CardHeader>
                <CardBody>
                  {questionInSondage &&
                    questionInSondage.map((item, i) => (
                      <div key={i} className="border-b mt-6 pb-4">
                        <p>
                          {i + 1 + ") "}
                          {item.question}
                        </p>
                        {renderTypeqQuestion(item)}
                      </div>
                    ))}
                </CardBody>
                <CardFooter className="justify-end">
                  {session && session.user ? (
                    checkIfUserAnswered ? (
                      <Chip color="warning" variant="faded">
                        Vos réponses à ce questionnaire ont déjà été
                        enregistrées.
                      </Chip>
                    ) : (
                      <Button
                        aria-disabled={loading}
                        className="text-white"
                        color="primary"
                        isDisabled={loading}
                        isLoading={loading}
                        onClick={handelSubmitSondage}
                      >
                        Envoyer vos réponse
                      </Button>
                    )
                  ) : (
                    <Button
                      as={Link}
                      href="/api/auth/signin"
                      variant="bordered"
                    >
                      Se connecter
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}
