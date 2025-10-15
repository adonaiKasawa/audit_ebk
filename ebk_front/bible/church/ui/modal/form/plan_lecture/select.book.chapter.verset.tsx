"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Selection } from "@react-types/shared";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

import { Form } from ".";

import {
  countChapters,
  countVerses,
} from "@/app/lib/actions/bible/bible.json.api";
import books from "@/lib/bible_book";

interface Props {
  day: number;
  forms: Form[];
  setForms: React.Dispatch<React.SetStateAction<Form[]>>;
}

const types = ["Tout le chapitre", "Plage de versets", "Verset unique"];
const initForm = { book: "", chapter: null, type: null, verse: null };

export function SelectBookChapterVerset({ day, forms, setForms }: Props) {
  const [verses, setVerses] = useState<number[]>([0]);
  const [countChapitre, setCountChapitre] = useState<number[]>([0]);
  const [selectBook, setSelectBook] = useState<Selection[]>([new Set([])]);
  const [selectChapter, setSelectChapter] = useState<Selection[]>([
    new Set([]),
  ]);
  const [selectVerseStart, setSelectVerseStart] = useState<Selection[]>([
    new Set([]),
  ]);
  const [selectVerseEnd, setSelectVerseEnd] = useState<Selection[]>([
    new Set([]),
  ]);
  const [selectTypeContent, setSelectTypeContent] = useState<Selection[]>([
    new Set([]),
  ]);

  const handleChange = async (
    index: number,
    field: keyof Form,
    value: string,
  ) => {
    setForms((prevForms) => {
      const newForms = [...prevForms];
      const formToUpdate = { ...newForms[index] };

      if (field === "type" && value === "0") {
        formToUpdate.verse = null;
        formToUpdate.type = value;
      } else {
        if (field !== "id") {
          formToUpdate[field] = value;
        }
      }

      newForms[index] = formToUpdate;

      return newForms;
    });
    if (field === "book") {
      await getCountChapter(index, value);
      if (forms[index].chapter) {
        await getCountVerses(index, value, forms[index].chapter || "");
      }
    } else if (field === "chapter") {
      await getCountVerses(index, forms[index].book, value);
    }
  };

  const addForm = useCallback(() => {
    if (forms) {
      const lastIndex = forms.length - 1;

      if (lastIndex >= 0) {
        const lastForm = forms[lastIndex];

        if (
          lastForm.book !== "" &&
          lastForm.chapter !== null &&
          lastForm.type !== null
        ) {
          if (
            ((lastForm.type === "1" || lastForm.type === "2") &&
              lastForm.verse !== null) ||
            (lastForm.type === "0" && lastForm.verse === null)
          ) {
            setForms((prevForms) => {
              const newForms = [...prevForms, initForm];

              return newForms;
            });
          } else {
            alert("Sélectionée le type de contenue et le verset correctemen");
          }
        } else {
          alert("Entre le livre et le chapitre correctement!");
        }
      } else {
        setForms([initForm]);
      }
    }
  }, [forms]);

  const removeAllForm = useCallback(() => {
    setSelectBook([]);
    setVerses([]);
    setCountChapitre([]);
    setForms([initForm]);
  }, []);

  const removeForm = useCallback((index: number) => {
    setSelectBook((prevBook) => {
      const newBook = prevBook.filter((_, i) => i !== index);

      return newBook;
    });
    setCountChapitre((prev) => {
      const newchapter = prev.filter((_, i) => i !== index);

      return newchapter;
    });
    setVerses((prev) => {
      const newVerset = prev.filter((_, i) => i !== index);

      return newVerset;
    });
    setForms((prevForms) => {
      const newForms = prevForms.filter((_, i) => i !== index);

      return newForms;
    });
  }, []);

  const handleRangeChange = (
    index: number,
    startOrEnd: "start" | "end",
    value: string,
  ) => {
    setForms((prevForms) => {
      const newForms = [...prevForms];
      const formToUpdate = { ...newForms[index] };
      const currentRange = formToUpdate.verse || "";
      let [start, end] = currentRange.split("-");

      if (startOrEnd === "start") {
        start = value;
      } else {
        end = value;
      }

      if (start && end && parseInt(start) > parseInt(end)) {
        alert(
          "Le verset de début doit être inférieur ou égal au verset de fin.",
        );

        return prevForms; // Retourne l'état précédent sans modification
      }

      formToUpdate.verse = `${start || ""}-${end || ""}`;
      newForms[index] = formToUpdate;

      return newForms;
    });
  };

  const getCountVerses = async (
    index: number,
    book: string,
    chapter: string,
  ) => {
    const result = await countVerses("lsg", book, chapter);

    setVerses((prevVerse) => {
      const newVerset = [...prevVerse];

      newVerset[index] = result;

      return newVerset;
    });
  };

  const getCountChapter = async (index: number, book: string) => {
    const chapter = await countChapters("lsg", book);

    setCountChapitre((prevchapter) => {
      const newchapter = [...prevchapter];

      newchapter[index] = chapter;

      return newchapter;
    });
  };

  useEffect(() => {
    if (forms.length > 0) {
      forms.map((f, i) => {
        setSelectBook((prev) => {
          const newBook = [...prev];

          newBook[i] = new Set([f.book]);

          return newBook;
        });
        getCountChapter(i, f.book);
        if (f.chapter !== null) {
          setSelectChapter((prev) => {
            const newchapter = { ...prev };

            newchapter[i] = new Set([f.chapter || ""]);

            return newchapter;
          });
          getCountVerses(i, f.book, f.chapter);
          if (f.type === "1") {
            const check = f.verse?.includes("-");

            if (check) {
              const startVerse = f.verse?.split("-")[0];
              const endVerse = f.verse?.split("-")[1];

              if (startVerse && endVerse) {
                setSelectVerseStart((prev) => {
                  const newItem = { ...prev };

                  newItem[i] = new Set([startVerse]);

                  return newItem;
                });
                setSelectVerseEnd((prev) => {
                  const newItem = { ...prev };

                  newItem[i] = new Set([endVerse]);

                  return newItem;
                });
              }
            }
          } else if (f.type === "2") {
            const check = f.verse?.includes("-");

            if (check) {
              const startVerse = f.verse?.split("-")[0];

              if (startVerse) {
                setSelectVerseStart((prev) => {
                  const newItem = { ...prev };

                  newItem[i] = new Set([startVerse]);

                  return newItem;
                });
              }
            }
          }
          setSelectTypeContent((prev) => {
            const newItem = { ...prev };

            newItem[i] = new Set([f.type || "0"]);

            return newItem;
          });
        }
      });
    }
  }, [forms]);

  return (
    <div className="container mx-auto p-4">
      {forms.map((form, index) => {
        return (
          <div key={index} className="mb-4 p-4 ">
            <Select
              key={`book-${form.book}-day-${day}-index-${index}`}
              fullWidth
              required
              aria-label={`book-${form.book}-day-${day}-index-${index}`}
              className="mb-2"
              isMultiline={false}
              label="Selection du livre"
              placeholder="Selection du livre"
              selectedKeys={selectBook[index]}
              selectionMode="single"
              value={`${form.book}`}
              variant="bordered"
              onChange={async (e) => {
                handleChange(index, "book", e.target.value);
              }}
              onSelectionChange={(k) => {
                setSelectBook((p) => ({ ...p, [index]: k }));
                const bookFiltered = selectBook;

                bookFiltered[index] = k;
                setSelectBook([...bookFiltered]);
              }}
            >
              {books.map((book) => (
                <SelectItem
                  key={book.Numero}
                  textValue={book.Nom}
                  // value={book.Numero}
                >
                  {book.Nom}
                </SelectItem>
              ))}
            </Select>
            {form.book !== "" && (
              <Select
                fullWidth
                required
                className="mb-2"
                isMultiline={false}
                label="Selection du chapitre"
                placeholder="Selection du chapitre"
                selectedKeys={selectChapter[index]}
                selectionMode="single"
                value={`${form.chapter}`}
                variant="bordered"
                onChange={async (e) => {
                  handleChange(index, "chapter", e.target.value);
                }}
                onSelectionChange={(c) => {
                  setSelectChapter((p) => ({ ...p, [index]: c }));
                }}
              >
                {Array.from({ length: countChapitre[index] }).map(
                  (_, i: number) => (
                    <SelectItem
                      key={`${i + 1}`}
                      textValue={`${i + 1}`}
                      // value={`${i + 1}`}
                    >
                      {i + 1}
                    </SelectItem>
                  ),
                )}
              </Select>
            )}
            {form.book && form.chapter && (
              <Select
                fullWidth
                required
                className="mb-2"
                isMultiline={false}
                label="Type du contenu"
                placeholder="Type du contenu"
                selectedKeys={selectTypeContent[index]}
                selectionMode="single"
                value={`${form.type}`}
                variant="bordered"
                onChange={async (e) => {
                  handleChange(index, "type", e.target.value);
                }}
                onSelectionChange={(c) => {
                  setSelectTypeContent((p) => ({ ...p, [index]: c }));
                }}
              >
                {types.map((type, idx) => (
                  <SelectItem key={idx} textValue={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            )}

            {form.type == "1" && (
              <>
                <Select
                  fullWidth
                  required
                  className="mb-2"
                  isMultiline={false}
                  label="Verset de départ"
                  placeholder="Selection verset de depart"
                  selectedKeys={selectVerseStart[index]}
                  selectionMode="single"
                  value={form?.verse?.split("-")[0] || ""}
                  variant="bordered"
                  onChange={(e) => {
                    handleRangeChange(index, "start", e.target.value);
                  }}
                  onSelectionChange={(c) => {
                    setSelectVerseStart((p) => ({ ...p, [index]: c }));
                  }}
                >
                  {Array.from({ length: verses[index] }, (v, i) => i + 1).map(
                    (ver) => (
                      <SelectItem
                        key={ver}
                        textValue={ver.toString()}
                        // value={ver}
                      >
                        {ver}
                      </SelectItem>
                    ),
                  )}
                </Select>
                <Select
                  fullWidth
                  required
                  className="mb-2"
                  isMultiline={false}
                  label="Verset final"
                  placeholder="Selection verset final"
                  selectedKeys={selectVerseEnd[index]}
                  selectionMode="single"
                  value={form?.verse?.split("-")[1] || ""}
                  variant="bordered"
                  onChange={(e) => {
                    handleRangeChange(index, "end", e.target.value);
                  }}
                  onSelectionChange={(c) => {
                    setSelectVerseEnd((p) => ({ ...p, [index]: c }));
                  }}
                >
                  {Array.from(
                    {
                      length: verses[index],
                    },
                    (v, i) => i + 1,
                  ).map((ver) => (
                    <SelectItem
                      key={ver}
                      textValue={ver.toString()}
                      // value={ver}
                    >
                      {ver}
                    </SelectItem>
                  ))}
                </Select>
              </>
            )}
            {form.type == "2" && (
              <Select
                fullWidth
                required
                className="mb-2"
                isMultiline={false}
                placeholder="Selection du verset"
                selectedKeys={selectVerseStart[index]}
                selectionMode="single"
                value={`${form?.verse}`}
                variant="bordered"
                onChange={(e) => handleChange(index, "verse", e.target.value)}
                onSelectionChange={(c) => {
                  setSelectVerseStart((p) => ({ ...p, [index]: c }));
                }}
              >
                {Array.from({ length: verses[index] }, (v, i) => i + 1).map(
                  (ver) => (
                    <SelectItem
                      key={ver}
                      textValue={ver.toString()}
                      // value={ver}
                    >
                      {ver}
                    </SelectItem>
                  ),
                )}
              </Select>
            )}
            <div className="flex justify-end my-4">
              <Button
                className="flex self-end"
                color="danger"
                size="sm"
                variant="bordered"
                onPress={() => {
                  removeForm(index);
                }}
              >
                Supprimer
              </Button>
            </div>
            <Divider style={{ marginBottom: 10 }} />
          </div>
        );
      })}

      <div className="flex justify-between">
        <Button variant="flat" onPress={addForm}>
          Ajouter du Contenu
        </Button>
        <Button color="danger" onPress={removeAllForm}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
