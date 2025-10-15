"use client";
import React, { useCallback, useState } from "react";
import { Selection } from "@react-types/shared";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";

import Alert from "../../alert";

import { SelectBookChapterVerset } from "./select.book.chapter.verset";
import IndicatorDayCreated from "./indicator.day.created";

import {
  createDayPlanLecture,
  createHeadPlanLecture,
  getContentDaysForPlan,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";
import { base64DataToFile, optCategoies } from "@/app/lib/config/func";
import { CropperImageUI } from "@/ui/cropperFile/image";
import {
  ContentDayPlan,
  ItemBiblePlanLecture,
} from "@/app/lib/config/interface";

export interface Form {
  book: string;
  chapter: string | null;
  type: string | null;
  verse: string | null;
  id?: number;
}

export interface Option {
  id: number;
  content: JSX.Element;
  imageUrl: string | File;
  contentUrl: string | File;
  fileSelected: Boolean;
  fileType: string;
  fileName: string;
}

export type SectionTitles = {
  [key: number]: string;
};

export const opt = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  content: <></>,
  imageUrl: "",
  contentUrl: "",
  fileSelected: false,
  fileType: "",
  fileName: "",
}));
export interface BookReference {
  book: string;
  chapter: string | null;
  verse: string | null;
}
export interface DaysCollection {
  [key: number]: BookReference[];
}
export interface DayObjectForm {
  [key: number]: Form[];
}
export interface TitleContentObject {
  [key: number]: string;
}
export interface BooleanObject {
  [key: number]: boolean;
}

const initForm = { book: "", chapter: null, type: null, verse: null };

export default function AddBiblePlanLectureFormModal() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [numberDay, setNumberDay] = useState("2");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const [isSave, setIsSave] = useState(false);

  const [titleContent, setTitleContent] = useState<TitleContentObject>({});
  const [devotion, setDevotion] = useState<TitleContentObject>({});

  const [isSaveContent, setIsSaveContent] = useState<BooleanObject>({});
  const [loadingContent, setLoadingContent] = useState<BooleanObject>({});

  const [actLecturePlan, setActLecturePlan] = useState<ItemBiblePlanLecture>();

  const [forms, setForms] = useState<Form[]>([initForm]);

  const [day, setDay] = useState<number>(1);
  const [selectDay, setSelectDay] = useState<Selection>(new Set([]));
  const [dayCreatedInPlan, SetDayCreatedInPlant] = useState<ContentDayPlan[]>(
    [],
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    const image = base64DataToFile(croppedImageUrl);

    formData.append("title", title);
    formData.append("description", description);
    formData.append("picture", image);
    formData.append("categorie", category);
    formData.append("number_days", `${parseInt(numberDay)}`);

    try {
      setLoading(true);
      const response = await createHeadPlanLecture(formData);

      setIsSave(true);
      setActLecturePlan(response);

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
      }
    } catch {
      setLoading(false);
    }
  };

  const handleDayContentSubmit = async (day: number) => {
    if (actLecturePlan) {
      setLoadingContent({ ...loadingContent, [day]: true });
      const response = await createDayPlanLecture(
        {
          dto: [
            {
              day: {
                title: titleContent[day],
                devotion: devotion[day],
                day,
              },
              content: forms.map((f) => ({
                book: f.book,
                chapter: f.chapter,
                verse: f.verse,
              })),
            },
          ],
        },
        actLecturePlan.id,
      );

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
      }
      await findDayCreatedByPlanId();
      setLoadingContent({ ...loadingContent, [day]: false });
      setIsSaveContent({ ...isSaveContent, [day]: true });
    }
  };

  const findDayCreatedByPlanId = useCallback(async () => {
    if (actLecturePlan) {
      const find = await getContentDaysForPlan(actLecturePlan.id);

      if (find.hasOwnProperty("statusCode") && find.hasOwnProperty("message")) {
        setOpenAlert(true);
        if (typeof find.message === "object") {
          let message = "";

          find.message.map((item: string) => (message += `${item} \n`));
          setAlertMsg(message);
        } else {
          setAlertMsg(find.message);
        }
      } else {
        SetDayCreatedInPlant(find);
      }
    }
  }, [actLecturePlan]);

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Ajouter plan de lecture
      </Button>

      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        scrollBehavior="outside"
        size="5xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        {!isSave && (
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Ajouter un plan de lecture
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-center h-full">
                    <form className="w-2/4" onSubmit={handleSubmit}>
                      <div>
                        <Input
                          className="mt-4 mb-4"
                          label="Titre"
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
                          label="Catégorie"
                          placeholder="Sélectionner la categorie"
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                          }}
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
                          value={numberDay}
                          variant="bordered"
                          onChange={(e) => setNumberDay(e.target.value)}
                        />
                        <div className="w-full mt-4 mb-4">
                          <Textarea
                            className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                            label="Déscripition"
                            placeholder="Entrer la description"
                            value={description}
                            variant="bordered"
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <CropperImageUI
                          croppedImageUrl={croppedImageUrl}
                          setCroppedImageUrl={setCroppedImageUrl}
                        />
                      </div>

                      <div className="flex justify-end my-4">
                        <Button isLoading={loading} type="submit">
                          Enregistrer
                        </Button>
                      </div>
                    </form>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        )}

        {isSave && actLecturePlan && (
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Contenu de par jour
                </ModalHeader>
                <ModalBody>
                  <div>
                    <div className="flex justify-center m-4">
                      <IndicatorDayCreated
                        SetDayCreatedInPlant={SetDayCreatedInPlant}
                        dayCreatedInPlan={dayCreatedInPlan}
                        number_days={parseInt(numberDay)}
                        planId={actLecturePlan.id}
                      />
                    </div>
                    <p className="text-center m-4">
                      {`Contenu pour le jour ${day}`}
                    </p>
                    <div className="flex justify-center h-full">
                      <form
                        className="w-2/4"
                        onSubmit={(e) => e.preventDefault()}
                      >
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
                            }}
                            onSelectionChange={(k) => {
                              setSelectDay(k);
                            }}
                          >
                            {Array.from({ length: parseInt(numberDay) }).map(
                              (_, i) => (
                                <SelectItem
                                  key={`${i + 1}`}
                                  textValue={`${i + 1}`}
                                  // value={`${i + 1}`}
                                >
                                  Jour {i + 1}
                                </SelectItem>
                              ),
                            )}
                          </Select>
                          <Input
                            required
                            className="mt-4 mb-4"
                            name="titre"
                            placeholder="Entrer le titre du plan"
                            type="text"
                            value={titleContent[day]}
                            variant="bordered"
                            onChange={(e) => {
                              setTitleContent({
                                ...titleContent,
                                [day]: e.target.value,
                              });
                            }}
                          />
                          <div className="w-full mt-4 mb-4">
                            <Textarea
                              required
                              className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                              label="Entrer la devotion du jour"
                              labelPlacement="outside"
                              placeholder="Entrer la devotion du jour"
                              value={devotion[day]}
                              variant="bordered"
                              onChange={(e) => {
                                setDevotion({
                                  ...devotion,
                                  [day]: e.target.value,
                                });
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
                        <div className="mt-4 mb-4">
                          <span className="flex items-center">
                            <span className="h-px flex-1 bg-slate-600" />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <Button
                            isLoading={loadingContent[day]}
                            type="submit"
                            onClick={() => handleDayContentSubmit(day)}
                          >
                            Envoyer
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* <Button className="m-2" onClick={() => {
                    console.log("titleContent", titleContent);
                    console.log("setTypeContent", typeContent);
                    handelAsyncTypeConte()
                    setTimeout(() => {
                      console.log("setTypeContent after fix", typeContent);
                    }, 500);
                  }}>
                    Voir
                  </Button> */}
                </ModalBody>
              </>
            )}
          </ModalContent>
        )}
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
