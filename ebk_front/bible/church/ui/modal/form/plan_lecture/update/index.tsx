"use client";

import React, { useEffect, useState } from "react";
import { Selection } from "@react-types/shared";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import Alert from "../../../alert";
import { Form, TitleContentObject } from "..";
import IndicatorDayCreated from "../indicator.day.created";
import { SelectBookChapterVerset } from "../select.book.chapter.verset";

import {
  getContentDaysForPlan,
  updateAllContentOfDays,
  updatePlanLecture,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";
import { optCategoies } from "@/app/lib/config/func";
import { ContentDayPlan } from "@/app/lib/config/interface";

export default function UpdateBiblePlanLectureFormModal({
  openModal,
  setOpenModal,
  plan,
  findPlan,
}: {
  openModal: boolean;
  setOpenModal: Function;
  plan: any;
  findPlan: () => Promise<void>;
}) {
  const [numberDay, setNumberDay] = useState<number>(plan.number_days);
  const [category] = useState<any>(plan.categorie);
  const [description, setDescription] = useState(plan.description);
  const [title, setTitle] = useState(plan.title);
  const [titleContent, setTitleContent] = useState<TitleContentObject>({});
  const [devotion, setDevotion] = useState<TitleContentObject>({});
  const [contentDays, setContentDays] = useState<ContentDayPlan[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [day, setDay] = useState<number>(1);
  const [selectDay, setSelectDay] = useState<Selection>(new Set(["1"]));

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const findContentDaysForPlanId = async () => {
    setLoading(true);
    const result = await getContentDaysForPlan(plan.id);

    setLoading(false);
    if (
      !result.hasOwnProperty("statusCode") &&
      !result.hasOwnProperty("message")
    ) {
      setContentDays(result);
      handleChangeSeletedDay(result);
    }
  };

  useEffect(() => {
    findContentDaysForPlanId();
  }, []);

  const createSectionContent = () => (
    <div>
      <div className="flex justify-center my-4">
        <IndicatorDayCreated
          SetDayCreatedInPlant={setContentDays}
          dayCreatedInPlan={contentDays}
          number_days={numberDay}
          planId={plan.id}
        />
      </div>
      <p className="text-center my-2">{`Contenu pour le jour ${day}`}</p>
      <div className="flex justify-center h-full">
        <div className="w-full" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Select
              key={`day-${day}`}
              fullWidth
              required
              aria-label={`day-${day}`}
              className="mb-2"
              isMultiline={false}
              label={`Jour ${day}`}
              placeholder="Selection du jour"
              selectedKeys={selectDay}
              selectionMode="single"
              variant="bordered"
              onChange={(e) => {
                setDay(parseInt(e.target.value));
                handleChangeSeletedDay(contentDays);
              }}
              onSelectionChange={(k) => {
                setSelectDay(k);
              }}
            >
              {Array.from({ length: numberDay }).map((_, i) => (
                <SelectItem
                  key={`${i + 1}`}
                  textValue={`${i + 1}`}
                  // value={`${i + 1}`}
                >
                  Jour {i + 1}
                </SelectItem>
              ))}
            </Select>
            <Input
              required
              className="mt-4 mb-4"
              label="Entrer le titre du plan"
              name="titre"
              placeholder="Entrer le titre du plan"
              type="text"
              value={titleContent[day]}
              variant="bordered"
              onChange={(e) => {
                setTitleContent({ ...titleContent, [day]: e.target.value });
              }}
            />
            <div className="w-full mt-4 mb-4">
              <Textarea
                required
                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                label="Entrer la devotion du jour"
                labelPlacement="inside"
                placeholder="Entrer la devotion du jour"
                value={devotion[day]}
                variant="bordered"
                onChange={(e) => {
                  setDevotion({ ...devotion, [day]: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="w-full mt-4 mb-4">
            <h3>Contenu</h3>
            <SelectBookChapterVerset
              day={day}
              forms={forms}
              setForms={setForms}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const handleChangeSeletedDay = (result: ContentDayPlan[]) => {
    if (result) {
      const dayOfContent = result.find((d) => d.day === day);

      if (dayOfContent) {
        const dayContent: Form[] = dayOfContent.contents.map((v) => ({
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          type: handleFormatVerse(v.verse),
          id: v.id,
        }));

        setForms(dayContent);
        setTitleContent({ ...titleContent, [day]: dayOfContent.title });
        setDevotion({ ...devotion, [day]: dayOfContent.devotion });
      }
    }
  };

  const handleFormatVerse = (verse: string | null) => {
    if (verse) {
      let checkExisteTrace = verse.includes("-");

      if (checkExisteTrace) {
        return "1";
      } else {
        return "2";
      }
    } else {
      return "0";
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await updatePlanLecture(plan.id, {
        title,
        description,
        categorie: category,
        number_days: numberDay,
      });

      setLoading(false);
      if (
        response.hasOwnProperty("statusCode") &&
        response.hasOwnProperty("message")
      ) {
        setOpenAlert(true);
        setAlertTitle("Erreur");
        if (typeof response.message === "object") {
          let message = "";

          response.message.map((item: string) => (message += `${item} \n`));
          setAlertMsg(message);
        } else {
          setAlertMsg(response.message);
        }
      } else {
        setOpenAlert(true);
        setAlertTitle("Modification");
        setAlertMsg("La modification du plan de lecture se bien passer");
        await findPlan();
      }
    } catch {
      setLoading(false);
    }
  };

  const handleDayContentSubmit = async (day: number) => {
    if (plan && day) {
      setLoading(true);
      const data = {
        dto: forms.map((f) => ({
          book: f.book,
          chapter: f.chapter,
          verse: f.verse,
          id: f.id,
        })),
      };
      const findDay = contentDays.find((d) => d.day === day);

      if (findDay) {
        const response = await updateAllContentOfDays(findDay.id, data);

        setLoading(false);

        if (
          response.hasOwnProperty("statusCode") &&
          response.hasOwnProperty("message")
        ) {
          setOpenAlert(true);
          setAlertTitle("Erreur");
          if (typeof response.message === "object") {
            let message = "";

            response.message.map((item: string) => (message += `${item} \n`));
            setAlertMsg(message);
          } else {
            setAlertMsg(response.message);
          }
        } else {
          setOpenAlert(true);
          setAlertTitle("Modification");
          setAlertMsg("La modification du plan de lecture se bien passer");
          await findContentDaysForPlanId();
        }
      }
    }
  };

  return (
    <>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        scrollBehavior="outside"
        size="5xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modification du plan de lecture
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center h-full">
                  <form className="w-3/5" onSubmit={handleSubmit}>
                    <div>
                      <Input
                        className="mt-4 mb-4"
                        name="titre"
                        placeholder="Entrer le titre du plan"
                        type="text"
                        value={title}
                        variant="bordered"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <Select
                        fullWidth
                        required
                        aria-label="1"
                        className="mb-2"
                        placeholder="Sélectionner la categorie"
                        selectedKeys={new Set([category])}
                        value={category}
                        variant="bordered"
                      >
                        {optCategoies.map((cat) => (
                          <SelectItem key={cat} textValue={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        className="mt-4 mb-4"
                        label="Nombre de jour"
                        name="objectif"
                        placeholder="Nombre de jour"
                        type="number"
                        value={numberDay.toString()}
                        variant="bordered"
                        onChange={(e) => setNumberDay(parseInt(e.target.value))}
                      />
                      <div className="w-full mt-4 mb-4">
                        <Textarea
                          className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                          labelPlacement="outside"
                          placeholder="Entrer la description"
                          value={description}
                          variant="bordered"
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button isLoading={loading} type="submit">
                        Modifier
                      </Button>
                    </div>
                    <div className="mt-4 mb-4">
                      <span className="flex items-center">
                        <span className="h-px flex-1 bg-slate-600" />
                      </span>
                    </div>

                    <React.Fragment>{createSectionContent()}</React.Fragment>

                    <div className="flex justify-end my-4">
                      <Button
                        isLoading={loading}
                        type="button"
                        onClick={() => {
                          handleDayContentSubmit(day);
                        }}
                      >
                        Modifier
                      </Button>
                    </div>
                  </form>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
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
    </>
  );
}
