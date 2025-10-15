"use client";
import React, { useEffect, useState } from "react";
import { Image } from "@heroui/image";

import { sondageQuestionType } from "../modal/form/sondageQst";
// import { ChartDonutComponent } from "../chart/chart-donut";
// import { ComponentChartLine } from "../chart/chart-line";
import { ChartDonutComponent } from "../chart/chart-donut";
import { ComponentChartLine } from "../chart/chart-line";

import { GroupedResponses, ResponseSondage } from "./interface";

import { QuestionnairesSondage } from "@/app/lib/config/interface";
import { SondageQuestionTypeEnum } from "@/app/lib/config/enum";
import { findAnswerBySondageIdApi } from "@/app/lib/actions/sondageQst/sondageQst.req";

export default function SondageStatistiqueView({
  sondageId,
  questionInSondage,
}: {
  sondageId: number;
  questionInSondage: QuestionnairesSondage[];
}) {
  const [sondageAnswer, setSondageAnswer] = useState<GroupedResponses[]>([]);
  // loading
  const [, setLoading] = useState<boolean>(false);
  // const [openAlert, setOpenAlert] = useState<boolean>(false);
  // const [alertMsg, setAlertMsg] = useState<string>("");
  // const [alertTitle, setAlertTitle] = useState<string>("");

  const handleFindSondageQstAnswer = async () => {
    setLoading(true);
    const sondage = await findAnswerBySondageIdApi(sondageId);

    setLoading(false);

    if (
      !sondage.hasOwnProperty("statusCode") &&
      !sondage.hasOwnProperty("message")
    ) {
      setSondageAnswer(sondage);
    }
  };

  const renderTypeqQuestion = (question: QuestionnairesSondage) => {
    switch (question.type) {
      case SondageQuestionTypeEnum.LADDER:
        return (
          <div className="flex gap-4 ml-4">
            {[
              Array.from({ length: 5 }).map((_, i) => {
                i++;

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center"
                    color="primary"
                  >
                    <Image height={40} src={`/icon/imoji${i}.png`} width={40} />
                    <p>{`OC-${i}`}</p>
                  </div>
                );
              }),
            ]}
          </div>
        );
      case SondageQuestionTypeEnum.TRICOLOR:
        return (
          <div className="flex gap-4 ml-4">
            {["1", "3", "5"].map((i) => {
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center"
                  color="primary"
                >
                  <Image height={40} src={`/icon/imoji${i}.png`} width={40} />
                  <p>{`OC-${i}`}</p>
                </div>
              );
            })}
          </div>
        );
      case SondageQuestionTypeEnum.MCC:
      case SondageQuestionTypeEnum.MCO:
        return (
          <div className="ml-4">
            {question.occurrences.map((item, i) => (
              <div key={item.id} className="flex gap-2">
                {" "}
                <p>OC-{i + 1 + `)`}</p> <p key={item.id}>{item.occurrence}</p>
              </div>
            ))}
          </div>
        );
      default:
        break;
    }
  };

  // const renderAnswer = (response: string, question: QuestionnairesSondage) => {
  //   switch (question.type) {
  //     case SondageQuestionTypeEnum.LADDER:
  //       return (
  //         <div className="flex gap-2 ml-4">
  //           <Button
  //             key={response}
  //             isIconOnly
  //             color="primary"
  //             size="sm"
  //             variant={"light"}
  //           >
  //             <Image
  //               height={24}
  //               src={`/icon/imoji${response}.png`}
  //               width={24}
  //             />
  //           </Button>
  //         </div>
  //       );
  //     case SondageQuestionTypeEnum.TRICOLOR:
  //       return (
  //         <div className="flex gap-2 ml-4">
  //           <Button
  //             key={response}
  //             isIconOnly
  //             color="primary"
  //             size="sm"
  //             variant={"light"}
  //           >
  //             <Image
  //               height={24}
  //               src={`/icon/imoji${response}.png`}
  //               width={24}
  //             />
  //           </Button>
  //         </div>
  //       );
  //     case SondageQuestionTypeEnum.MCC:
  //       const resMcc = question.occurrences.find(
  //         (item) => item.id === parseInt(response),
  //       );

  //       return <div className="ml-4">{resMcc && resMcc.occurrence}</div>;
  //     case SondageQuestionTypeEnum.MCO:
  //       const res = response.split(",");

  //       return (
  //         <>
  //           {res.map((e) => {
  //             const resMco = question.occurrences.find(
  //               (item) => item.id === parseInt(e),
  //             );

  //             return <p key={`${e}`}>{resMco && resMco.occurrence}</p>;
  //           })}
  //         </>
  //       );
  //     case SondageQuestionTypeEnum.MCOT:
  //       return <p>{response}</p>;
  //     default:
  //       break;
  //   }
  // };

  const getChartData = (
    question: QuestionnairesSondage,
    responses: ResponseSondage[],
  ): { occurrence: string; response: number; fill: string }[] => {
    const colors = ["#e8567a", "#6171ff", "#ed7c02", "#39cc04", "#e332dd"];

    const occurrenceCount: Record<string, number> = {};

    responses.forEach((response) => {
      switch (question.type) {
        case SondageQuestionTypeEnum.TRICOLOR:
          const responseValue = Number(response.response);

          if ([1, 3, 5].includes(responseValue)) {
            occurrenceCount[`OC-${responseValue}`] =
              (occurrenceCount[`OC-${responseValue}`] || 0) + 1;
          }
          break;

        case SondageQuestionTypeEnum.LADDER:
          // Générer des occurrences OC-1 à OC-5
          for (let i = 1; i <= 5; i++) {
            if (response.response === `${i}`) {
              occurrenceCount[`OC-${i}`] =
                (occurrenceCount[`OC-${i}`] || 0) + 1;
            }
          }
          break;

        case SondageQuestionTypeEnum.MCC:
          // Utiliser la réponse comme l'ID d'une occurrence
          const occurrenceMCC = question.occurrences.find(
            (occ) => occ.id === Number(response.response), // Comparer avec l'id de l'occurrence
          );

          if (occurrenceMCC) {
            occurrenceCount[occurrenceMCC.occurrence] =
              (occurrenceCount[occurrenceMCC.occurrence] || 0) + 1;
          }
          break;

        case SondageQuestionTypeEnum.MCO:
          const responseArray = response.response.split(",");

          responseArray.forEach((resp) => {
            const occurrenceMCO = question.occurrences.find(
              (occ) => occ.id === Number(resp.trim()),
            );

            if (occurrenceMCO) {
              occurrenceCount[occurrenceMCO.occurrence] =
                (occurrenceCount[occurrenceMCO.occurrence] || 0) + 1;
            }
          });
          break;

        case SondageQuestionTypeEnum.MCOT:
          // Ne rien faire pour MCOT
          break;
      }
    });

    return Object.entries(occurrenceCount).map(
      ([occurrence, count], index) => ({
        occurrence,
        response: count,
        fill: colors[index % colors.length],
      }),
    );
  };

  useEffect(() => {
    handleFindSondageQstAnswer();
  }, []);

  return (
    <div>
      {sondageAnswer &&
        sondageAnswer.map(({ question }) => {
          const qstInSondage = questionInSondage.find(
            (qst) => qst.id === question.id,
          );
          const type = sondageQuestionType.find((e) => e.key === question.type);

          return (
            <div
              key={question.id}
              className="border border-current rounded-lg my-4 p-4 "
            >
              <p>{question.question}</p>
              <p>Type de la question: {type?.value}</p>
              <div className="my-8" style={{ marginTop: 20, marginBottom: 20 }}>
                {qstInSondage && renderTypeqQuestion(qstInSondage)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="col-span-2">
            {question.responses.map((res) => {

              return <div key={`res-${res.id}`} className="border-b border-neutrale-5 mx-2 ml-8">
                <div className="flex gap-4">responses: {qstInSondage && renderAnswer(res.response, qstInSondage)}</div>
                <p>Participant: {res.user.nom} {res.user.prenom}</p>
                <p>date:{moment(res.createdAt).fromNow()}</p>
              </div>
            })}
          </div> */}
                <div className="col-span-2 md:col-span-1">
                  <ComponentChartLine
                    data={
                      qstInSondage
                        ? getChartData(qstInSondage, question.responses)
                        : []
                    }
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <ChartDonutComponent
                    data={
                      qstInSondage
                        ? getChartData(qstInSondage, question.responses)
                        : []
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
