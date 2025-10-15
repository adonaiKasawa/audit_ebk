import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { MdDeleteForever } from "react-icons/md";
import { Button } from "@heroui/button";

import books from "@/lib/bible_book";
import { countVerses } from "@/app/lib/actions/bible/bible.json.api";

interface Form {
  book: string | null;
  chapter: string | null;
  type: string | null;
  verse: string | null;
  id: string | null;
}

interface Props {
  setData?: Function;
  day: number;
  contents: any[];
}

const DynamicForm: React.FC<Props> = ({ setData, day, contents }) => {
  // const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [forms, setForms] = useState<Form[]>(contents);
  // const chapters = Array.from({ length: 50 }, (_, i) => (i + 1).toString()); // Exemple de chapitres
  // const verses = Array.from({ length: 176 }, (_, i) => (i + 1).toString()); // Exemple de versets
  const types = ["Tout le chapitre", "Plage de versets", "Verset unique"];
  const [verse, setVerses] = useState<number>(0);

  const handleChange = (index: number, field: keyof Form, value: string) => {
    if (field === "type" && value === "0") {
      const newForms = [...forms];

      newForms[index].verse = null;
      setForms(newForms);
    }
    const newForms = [...forms];

    newForms[index][field] = value;
    setForms(newForms);
  };

  const handleRangeChange = (
    index: number,
    startOrEnd: "start" | "end",
    value: string,
  ) => {
    const newForms = [...forms];
    const currentRange = newForms[index].verse || "";
    let [start, end] = currentRange.split("-");

    if (startOrEnd === "start") {
      start = value;
    } else {
      end = value;
    }

    if (start && end && parseInt(start) > parseInt(end)) {
      alert("Le verset de début doit être inférieur ou égal au verset de fin.");

      return;
    }

    newForms[index].verse = `${start || ""}-${end || ""}`;
    setForms(newForms);
  };

  useEffect(() => {
    if (setData)
      setData((data: any) => {
        return {
          ...data,
          [day]: forms.map(({ book, chapter, verse }) => {
            return { book, chapter, verse };
          }),
        };
      });
  }, [forms]);

  // const addForm = () => {
  //   setForms([...forms, { book: "", chapter: "", type: "", verse: "" }]);
  // };

  const getCountVerses = async (book: string, chapter: string) => {
    const result = await countVerses("lsg", book, chapter);

    setVerses(result);
  };

  const checkStringType = (value: string | null): number | null => {
    if (value === null) {
      return null;
    }

    const rangeRegex = /^\d+-\d+$/;
    const singleDigitRegex = /^\d+$/;

    if (rangeRegex.test(value)) {
      return 1;
    }

    if (singleDigitRegex.test(value)) {
      return 2;
    }

    return 0;
  };

  return (
    <div className="container mx-auto p-4">
      {forms.map((form, index) => {
        if (form.type == undefined)
          return (
            <Card
              key={index}
              style={{
                marginBottom: 5,
              }}
            >
              <CardBody>
                <div
                  className="flex"
                  style={{
                    justifyContent: "space-around",
                    alignContent: "center",
                  }}
                >
                  <h4>
                    {`${books.find((b) => b.Numero.toString() === form.book)?.Nom} ${
                      form.chapter
                    }${
                      form.verse == null
                        ? " (tout le chapitre)"
                        : `:${form.verse}`
                    }`}
                  </h4>
                  <div>
                    <MdDeleteForever
                      color="red"
                      size={25}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setForms(forms.filter((f, idx) => index != idx));
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          );

        return (
          <div key={index} className="mb-4 border p-4 rounded shadow-md">
            <Select
              fullWidth
              required
              aria-label="1"
              className="mb-2"
              // defaultSelectedKeys={[form.book]}
              placeholder="Selection du livre"
              value={`${form.book}`}
              onChange={async (e) => {
                handleChange(index, "book", e.target.value);
                if (form.chapter && form.book)
                  await getCountVerses(form.book, form.chapter);
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
            {form.book && (
              <Select
                fullWidth
                required
                aria-label="1"
                className="mb-2"
                // defaultSelectedKeys={[form.chapter]}
                placeholder="Selection du chapitre"
                value={`${form.chapter}`}
                onChange={async (e) => {
                  handleChange(index, "chapter", e.target.value);
                  if (form.chapter && form.book)
                    await getCountVerses(form.book, form.chapter);
                }}
              >
                {Array.from(
                  {
                    length:
                      books.find(
                        ({ Numero }) => Numero == parseInt(`${form.book}`),
                      )?.Chapitres || 0,
                  },
                  (v, i) => i + 1,
                ).map((chapter, idx) => (
                  <SelectItem
                    key={idx}
                    textValue={`${chapter}`}
                    // value={chapter}
                  >
                    {chapter}
                  </SelectItem>
                ))}
              </Select>
            )}
            {form.book && form.chapter && (
              <Select
                fullWidth
                required
                aria-label="1"
                className="mb-2"
                defaultSelectedKeys={[
                  form.verse == null
                    ? "0"
                    : form.verse.split("-")?.[0]
                      ? "1"
                      : "2",
                ]}
                placeholder="Type du contenu"
                value={
                  form.verse == null
                    ? "0"
                    : form.verse.split("-")?.[0]
                      ? "1"
                      : "2"
                }
                onChange={async (e) => {
                  handleChange(index, "type", e.target.value);
                  if (form.book && form.chapter)
                    await getCountVerses(form.book, form.chapter);
                }}
              >
                {types.map((type, idx) => (
                  <SelectItem key={idx} textValue={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            )}
            <Divider style={{ marginBottom: 10 }} />
            {(form.type == "1" || checkStringType(form.verse) == 1) && (
              <>
                <Select
                  fullWidth
                  className="mb-2"
                  // defaultSelectedKeys={[form?.verse?.split("-")[0]]}
                  placeholder="Selection verset de depart"
                  value={form?.verse?.split("-")[0] || ""}
                  onChange={(e) =>
                    handleRangeChange(index, "start", e.target.value)
                  }
                >
                  {Array.from(
                    {
                      length: verse,
                    },
                    (v, i) => i + 1,
                  ).map((ver, idx) => (
                    <SelectItem
                      key={idx}
                      textValue={ver.toString()}
                      // value={ver}
                    >
                      {ver}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  fullWidth
                  required
                  aria-label="1"
                  className="mb-2"
                  // defaultSelectedKeys={[form?.verse?.split("-")[1]]}
                  placeholder="Selection verset final"
                  value={form?.verse?.split("-")[1] || ""}
                  onChange={(e) =>
                    handleRangeChange(index, "end", e.target.value)
                  }
                >
                  {Array.from(
                    {
                      length: verse,
                    },
                    (v, i) => i + 1,
                  ).map((ver, idx) => (
                    <SelectItem
                      key={idx}
                      textValue={ver.toString()}
                      // value={ver}
                    >
                      {ver}
                    </SelectItem>
                  ))}
                </Select>
              </>
            )}

            {(form.type == "2" || checkStringType(form.verse) == 2) && (
              <Select
                fullWidth
                required
                className="mb-2"
                // defaultSelectedKeys={[form?.verse]}
                placeholder="Selection du verset"
                value={`${form?.verse}`}
                onChange={(e) => handleChange(index, "verse", e.target.value)}
              >
                {Array.from(
                  {
                    length: verse,
                  },
                  (v, i) => i + 1,
                ).map((ver, idx) => (
                  <SelectItem key={idx} textValue={`${ver}`}>
                    {ver}
                  </SelectItem>
                ))}
              </Select>
            )}
            <div
              className="flex"
              style={{
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                {form.id && (
                  <Button
                    // isLoading={loadingContent[parseInt(form.id)]}
                    type="submit"
                    onPress={async () => {
                      // setLoadingContent({
                      //   ...loadingContent,
                      //   [form.id]: true,
                      // });
                      // setLoadingContent({
                      //   ...loadingContent,
                      //   [form.id]: false,
                      // });
                    }}
                  >
                    Maj
                  </Button>
                )}
              </div>
              <div>
                <MdDeleteForever
                  color="red"
                  size={25}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setForms(forms.filter((f, idx) => index != idx));
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
      {/* <Button flat onClick={addForm}>
        Ajouter du Contenu
      </Button> */}
    </div>
  );
};

export default DynamicForm;
