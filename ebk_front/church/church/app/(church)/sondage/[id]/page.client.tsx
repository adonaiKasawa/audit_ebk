"use client";

import { Session } from "next-auth";
import React, { useState } from "react";
import { CiEdit, CiSquareQuestion, CiTrash } from "react-icons/ci";
import clsx from "clsx";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";

import { SondageQuestionTypeEnum } from "@/app/lib/config/enum";
import Alert from "@/ui/modal/alert";
import {
  AddOccurenceSondageQst,
  AddQeustionInSondageFormModal,
  UpdateOrDeleteOccurenceSondageQst,
  UpdateOrDeleteSondageQst,
} from "@/ui/modal/form/sondageQst";
import {
  ItemSondageQstDetail,
  QuestionnairesSondage,
} from "@/app/lib/config/interface";
import {
  addOccurenceInSondageQuestionApi,
  CreateSQOccurenceDto,
  deleteQuestionInSondageApi,
  deleteSondageQstOccurenceApi,
  findSondageQstByIdApi,
  updateQuestionInSondageApi,
  updateSondageQstOccurenceApi,
} from "@/app/lib/actions/sondageQst/sondageQst.req";
import SondageQuestionTableUI from "@/ui/table/sondage/sondage.ssr.table";
import SondageStatistiqueView from "@/ui/sondage";

export default function SondageQstByIdPageClient({
  initData,
  params,
}: {
  session: Session;
  initData: { sondage: ItemSondageQstDetail };
  params: { id: string };
}) {
  const sondageId = parseInt(params.id);
  const [sondageQst, setSondageQst] = useState<ItemSondageQstDetail>(
    initData.sondage,
  );
  const [questionInSondage, setQuestionInSondage] = useState<
    QuestionnairesSondage[]
  >(sondageQst.questions);

  const [questionSelected, setQuestionSelect] = useState<QuestionnairesSondage>(
    questionInSondage[0],
  );
  const [occurences, setOccurences] = useState<CreateSQOccurenceDto[]>([
    { occurrence: "" },
  ]);
  const [onUpdating, setOnUpdating] = useState<boolean>(false);
  const [qstValue, setQstValue] = useState<string>("");

  const [viewStatistique, setViewStatistique] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleFindSondageQst = async () => {
    const sondage = await findSondageQstByIdApi(sondageId);

    if (
      !sondage.hasOwnProperty("statusCode") &&
      !sondage.hasOwnProperty("message")
    ) {
      setSondageQst(sondage);
      setQuestionInSondage(sondage.questions);
      const qstSelected = sondage.questions.find(
        (item: QuestionnairesSondage) => item.id === questionSelected.id,
      );

      if (qstSelected) {
        setQuestionSelect(qstSelected);
        setQstValue(qstSelected.question);
      } else {
        if (sondage.questions && sondage.questions.length > 0) {
          setQuestionSelect(sondage.questions[0]);
          setQstValue(sondage.questions[0].question);
        }
      }
    }
  };

  const handleChangeOccurence = async (
    data: CreateSQOccurenceDto,
    id: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    const update = await updateSondageQstOccurenceApi(
      {
        occurrence: data.occurrence,
      },
      id,
    );

    if (
      !update.hasOwnProperty("statusCode") &&
      !update.hasOwnProperty("message")
    ) {
      setLoading(false);
      setOpenAlert(true);
      setAlertMsg("La modification de l'occurence se bien passer");
      handleFindSondageQst();
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

  const handleDeleleOccurenceSubimt = async (
    id: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    const deleteRequest = await deleteSondageQstOccurenceApi(id);

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
      handleFindSondageQst();
      handleResetOccurenceForm();
    }
  };

  const handleAddOccurenceForm = () => {
    const lastIndex = occurences.length - 1;
    const lastOccurrence = occurences[lastIndex];

    if (lastOccurrence.occurrence !== "") {
      setOccurences([...occurences, { occurrence: "" }]);
    } else {
      setOpenAlert(true);
      setAlertMsg("Veillez remplir la derniere occurence correctement!");
    }
  };

  const handleResetOccurenceForm = () => {
    setOccurences([{ occurrence: "" }]);
  };

  const handleAddOccerenceSubmit = async () => {
    setLoading(true);
    const creatOccurence = await addOccurenceInSondageQuestionApi(
      {
        dto: occurences,
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

        creatOccurence.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(creatOccurence.message);
      }
    } else {
      handleFindSondageQst();
      handleResetOccurenceForm();
    }
  };

  const handleChangeQuesthion = (index: number) => {
    setQuestionSelect(questionInSondage[index]);
    handleResetOccurenceForm();
    setQstValue(questionInSondage[index].question);
  };

  const handleUpdateQuestionSubmit = async (id: number) => {
    setLoading(true);
    const update = await updateQuestionInSondageApi({ question: qstValue }, id);

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
      handleFindSondageQst();
      handleResetOccurenceForm();
    }
  };

  const handleDeleleQuestionSubimt = async (id: number) => {
    setLoading(true);
    const deleteRequest = await deleteQuestionInSondageApi(id);

    setLoading(false);
    if (
      deleteRequest.hasOwnProperty("statusCode") &&
      deleteRequest.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof deleteRequest.message === "object") {
        let message = "";

        deleteRequest.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(deleteRequest.message);
      }
    } else {
      setOnUpdating(false);
      handleFindSondageQst();
      handleResetOccurenceForm();
    }
  };

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
              <div className="flex justify-end items-center gap-4">
                <AddQeustionInSondageFormModal
                  handleFindSondageQst={handleFindSondageQst}
                  sondageId={sondageId}
                />
                <UpdateOrDeleteSondageQst
                  handleFindSondageQst={handleFindSondageQst}
                  sondage={sondageQst}
                />
                <Button
                  isIconOnly
                  className="text-foreground"
                  size="sm"
                  variant="bordered"
                  onClick={() => {
                    setViewStatistique(!viewStatistique);
                  }}
                >
                  {viewStatistique ? (
                    <CiSquareQuestion className="text-foreground" size={24} />
                  ) : (
                    <HiOutlineChartBarSquare
                      className="text-foreground"
                      size={24}
                    />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {!viewStatistique && (
              <div>
                <Card>
                  <CardHeader>Questions</CardHeader>
                  <Divider />
                  <CardBody>
                    {questionInSondage && questionInSondage.length > 0 ? (
                      questionInSondage.map((item, i) => (
                        <div
                          key={i}
                          className={clsx(
                            "py-4 border-b rounded-md cursor-pointer",
                            {
                              "bg-default-200": item.id === questionSelected.id,
                            },
                          )}
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
                  </CardBody>
                </Card>
              </div>
            )}
            {!viewStatistique && (
              <div className="col-span-2">
                <Card>
                  <CardHeader className="text-2xl">
                    Question & Occurrences
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
                          <div className="flex justify-end gap-4 my-2">
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
                              aria-disabled={loading}
                              isLoading={loading}
                              size="sm"
                              title="Supprimer la question"
                              variant="bordered"
                              onClick={() => {
                                handleDeleleQuestionSubimt(questionSelected.id);
                              }}
                            >
                              <CiTrash size={24} />
                            </Button>
                          </div>
                        </div>
                        <Divider />

                        {questionSelected.type !==
                          SondageQuestionTypeEnum.LADDER &&
                          questionSelected.type !==
                            SondageQuestionTypeEnum.TRICOLOR && (
                            <>
                              <p className="text-xl text-center">Occurences</p>
                              {questionSelected.occurrences !== undefined &&
                              questionSelected.occurrences.length > 0 ? (
                                questionSelected?.occurrences.map((item, i) => (
                                  <UpdateOrDeleteOccurenceSondageQst
                                    key={i}
                                    handleChangeOccurence={
                                      handleChangeOccurence
                                    }
                                    handleDeleleOccurenceSubimt={
                                      handleDeleleOccurenceSubimt
                                    }
                                    index={i}
                                    occurence={item}
                                  />
                                ))
                              ) : (
                                <p className="my-8 text-2xl text-center text-default-400">
                                  Aucune occurence trouver !
                                </p>
                              )}
                            </>
                          )}
                        {questionSelected.type ===
                          SondageQuestionTypeEnum.LADDER && (
                          <div className="flex justify-center my-4 gap-2">
                            {[
                              Array.from({ length: 5 }).map((_, i) => {
                                i++;

                                return (
                                  <>
                                    <Image
                                      alt={`imoji${i}.png`}
                                      height={50}
                                      src={`/icon/imoji${i}.png`}
                                      width={50}
                                    />
                                  </>
                                );
                              }),
                            ]}
                          </div>
                        )}
                        {questionSelected.type ===
                          SondageQuestionTypeEnum.TRICOLOR && (
                          <div className="flex justify-center my-4 gap-2">
                            {["1", "3", "5"].map((i) => {
                              return (
                                <>
                                  <Image
                                    alt={`--imoji${i}.png`}
                                    height={50}
                                    src={`/icon/imoji${i}.png`}
                                    width={50}
                                  />
                                </>
                              );
                            })}
                          </div>
                        )}
                        {questionSelected.type !==
                          SondageQuestionTypeEnum.LADDER &&
                          questionSelected.type !==
                            SondageQuestionTypeEnum.TRICOLOR && (
                            <div className="flex flex-col gap-4">
                              <p className="mt-4 text-xl text-center">
                                Ajouter des occcurences à la question
                              </p>
                              {occurences.map((_, i) => (
                                <AddOccurenceSondageQst
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
                                  Ajouter une autre occurence
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
            )}

            {viewStatistique && (
              <div className="col-span-3">
                <Card>
                  <CardHeader className="text-2xl">
                    Résultat du sondage
                  </CardHeader>
                  <CardBody className="gap-4">
                    <SondageQuestionTableUI initData={questionInSondage} />
                    <SondageStatistiqueView
                      questionInSondage={questionInSondage}
                      sondageId={sondageId}
                    />
                  </CardBody>
                </Card>
              </div>
            )}
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
