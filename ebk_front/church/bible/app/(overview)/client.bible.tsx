"use client";

import { MdDelete } from "react-icons/md";
import { Session } from "next-auth";
import { useState } from "react";
import moment from "moment";
import { useTheme } from "next-themes";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

import books from "@/lib/bible_book";
import { getBibleVersion } from "@/lib/utils";
import { versions } from "@/lib/version";
import {
  InputTagInterface,
  deleteTagBible,
  deleteHistoryBible,
} from "@/app/lib/actions/bible/bible.req";
import { DropdownBible } from "@/components/ui/Dropdown_Bible";
import TagModal from "@/components/ui/tag_modal";
import MenuContext from "@/components/ui/menu_context";
export function ClientBible({
  initData,
  session,
}: {
  initData: {
    tags: any;
    history: any;
  };
  session: Session | null;
}) {
  const { theme } = useTheme();
  // const { isLoading: requestLoading, refetch: refetchHistory } = useQuery(
  //   "getHistory",
  //   {
  //     queryFn: async () => {
  //       const history = await getHistoryBible(session?.user?.sub);
  //       if (history[0]) {
  //         const data = history[history.length - 1];
  //         setVersion(data.version);
  //         setBook(data.book);
  //         setChapter(data.chapter);
  //       } else {
  //         setVersion("lsg");
  //         setBook(1);
  //         setChapter(1);
  //       }
  //       setDataHistory(history);
  //     },
  //   }
  // );
  // const { isLoading: requestTagLoading, refetch: refetchTag } = useQuery(
  //   "getTag",
  //   {
  //     queryFn: async () => {
  //       const data = await getTagBible(session?.user?.sub);
  //       if (data) setDataTag(data);
  //     },
  //   }
  // );

  const [dataHistory] = useState<any[]>(initData.history);
  const [dataTag] = useState<any[]>(initData.tags);
  const [componentBible, setComponentBible] = useState<string>("tag");
  const [loading, setLoading] = useState<boolean>(false);
  const [version, setVersion] = useState<string>("lsg");
  const [book, setBook] = useState<any>("1");
  const [chapter, setChapter] = useState<number | null>(1);
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["1"]));
  const [color, setColor] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [verset, setVerset] = useState<string>("1");

  function viewChapter() {
    return Array.from(
      {
        length: books.find(({ Numero }) => Numero == book)?.Chapitres || 0,
      },
      (v, i) => i + 1,
    );
  }

  async function setTag({}: InputTagInterface) {
    setLoading(true);
    // await postTagBible({
    //   title,
    //   description,
    //   version,
    //   book,
    //   chapter,
    //   verse,
    //   colorTag,
    // });
    // await refetchTag();
    setLoading(false);
  }

  // const setHistory = useCallback(async () => {
  //   if (["", undefined].includes(version?.trim())) return;
  //   // setLoading(true);
  //   await postHistoryBible({
  //     version,
  //     book: book + "",
  //     chapter: chapter + "",
  //     verse: "1",
  //   });
  //   await refetchHistory();

  //   // setLoading(false);
  // }, [refetchHistory, version, book, chapter])

  // useEffect(() => {
  //   if (chapter != 0 && chapter != undefined) {
  //     setHistory();
  //   }
  // }, [setHistory, chapter]);

  // useEffect(() => {
  //   if (!session?.user?.sub) {
  //     setVersion("lsg");
  //     setBook(1);
  //     setChapter(1);
  //   }
  // }, [session?.user?.sub]);

  return (
    <div className="md:flex">
      {session?.user && (
        <div className="w-full md:w-3/10  md:w-[30%] lg:w-[30%] p-4" >
          <DropdownBible
            setComponent={setComponentBible}
            title={componentBible}
          />

          <div
            className="p-4 max-h-screen overflow-y-auto"
            // style={{ maxHeight: 500 }}
          >
            {componentBible == "tag" && (
              <>
                {/* {requestTagLoading && <Spinner />} */}
                {dataTag &&
                  dataTag[0] &&
                  dataTag?.map((data: any, key: number) => {
                    return (
                      <Card key={key} style={{ marginBottom: 10 }}>
                        <CardBody>
                          <div key={key} className=" rounded-md p-1 mb-1 ">
                            <button
                              className="text-lg font-semibold m-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setVersion(data.version);
                                setBook(data.book);
                                setChapter(data.chapter);
                              }}
                            >
                              <Chip>{data.title}</Chip>
                              <p>
                                {books.find(
                                  ({ Numero }) => Numero == parseInt(data.book),
                                )?.Nom + " "}{" "}
                                {data.chapter}:{data.verse}
                              </p>
                              <p
                                className="capitalize"
                                style={{ fontSize: 11 }}
                              >
                                Version:{" "}
                                {
                                  versions.find(
                                    (ver) =>
                                      ver.id.toLowerCase() == data.version,
                                  )?.name
                                }
                              </p>
                              <p style={{ fontSize: 14, cursor: "pointer" }}>
                                {data.description.slice(0, 30)} ...
                              </p>
                            </button>
                            <div
                              className="flex"
                              style={{ justifyContent: "space-between" }}
                            >
                              <small style={{ fontSize: 9 }}>
                                {moment(data?.createdAt).fromNow()}
                              </small>
                              <button
                                style={{ cursor: "pointer" }}
                                onClick={async () => {
                                  await deleteTagBible(data.id);
                                  // await refetchTag();
                                }}
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
              </>
            )}

            {componentBible == "historique" && (
              <div className="max-h-screen">
                {/* {requestLoading && <Spinner />} */}
                {dataHistory &&
                  dataHistory[0] &&
                  dataHistory.map((data: any, key: number) => {
                    return (
                      <Card key={key} style={{ marginBottom: 10 }}>
                        <CardBody>
                          <div key={key} className="rounded-md p-1 mb-1">
                            <button
                              className="text-lg font-semibold"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setVersion(data.version);
                                setBook(data.book);
                                setChapter(data.chapter);
                              }}
                            >
                              {books.find(
                                ({ Numero }) => Numero == parseInt(data.book),
                              )?.Nom + " "}{" "}
                              {data.chapter} (
                              <small>
                                {
                                  versions.find(
                                    (ver) =>
                                      ver.id.toLowerCase() == data.version,
                                  )?.name
                                }
                              </small>
                              )
                            </button>
                            <div
                              className="flex"
                              style={{ justifyContent: "space-between" }}
                            >
                              <small style={{ fontSize: 9 }}>
                                {moment(data?.createdAt).fromNow()}
                              </small>
                              <button
                                style={{ cursor: "pointer" }}
                                onClick={async () => {
                                  await deleteHistoryBible(data.id);
                                  // await refetchHistory();
                                }}
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className="w-full md:w-3/10 p-4 md:w-[70%] lg:w-[70%]"
        //style={{ width: session?.user ? "70%" : "100%" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <Select
            className="max-w-xs"
            label="Version de la bible"
            selectedKeys={[version]}
            onChange={({ target }: { target: any }) => {
              setVersion(target.value);
            }}
          >
            {versions.map((data: any) => (
              <SelectItem
                key={data.id.toLowerCase()}
                textValue={data.name}
                // value={data.id.toLowerCase()}
              >
                {data.name} {data.id.toLowerCase()} (
                {data.type == "fr"
                  ? "Version francaise"
                  : data.type == "en"
                    ? "Version anglais"
                    : "Autre"}
                )
              </SelectItem>
            ))}
          </Select>
          <Select
            className="max-w-xs"
            label="Livre de la bible"
            selectedKeys={[`${book}`]}
            onChange={({ target }: { target: any }) => {
              setBook(parseInt(target.value));
            }}
          >
            {books.map((data: any) => {
              return (
                <SelectItem
                  key={`${data.Numero}`}
                  textValue={data.Nom}
                  // value={data.Numero}
                >
                  {data.Nom} {data.Numero}
                </SelectItem>
              );
            })}
          </Select>
        </div>
        {!["", undefined].includes(version.trim()) &&
          !["", null, undefined].includes(book) && (
            <Accordion
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <AccordionItem
                key="1"
                aria-label="Accordion bible"
                title="Chapitres"
              >
                {/* {!loading && book && chapter && <Divider />} */}
                <div style={{ marginTop: 5 }}>
                  {viewChapter().map((chap) => (
                    <Button
                      key={chap}
                      color="primary"
                      disabled={chap === chapter}
                      size="sm"
                      style={{ margin: 3, width: 10 }}
                      onClick={() => {
                        setChapter(chap);
                        setSelectedKeys(new Set(["2"]));
                      }}
                    >
                      {chap}
                    </Button>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          )}
        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        <div
          className="flex"
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {/* {loading && <Spinner />} */}
          {!loading &&
            !["", undefined].includes(version.trim()) &&
            book &&
            chapter && (
              <>
                {!loading &&
                  !["", undefined].includes(version.trim()) &&
                  book && (
                    <h1 className="capitalyse text-3xl">
                      {books.find(({ Numero }) => Numero == book)?.Nom}{" "}
                      {chapter}
                    </h1>
                  )}
                <div>
                  {Object.keys(
                    getBibleVersion(version)?.[book]?.[chapter] || {},
                  ).map((idx) => {
                    return (
                      <div key={idx} style={{ fontSize: 15 }}>
                        <TagModal
                          color={color}
                          open={open}
                          other={{
                            version,
                            book: book,
                            chapter,
                            verset: idx,
                            description:
                              getBibleVersion(version)[book]?.[chapter]?.[idx],
                          }}
                          setOpen={setOpen}
                          setTag={setTag}
                          verset={verset}
                        />
                        <MenuContext
                          key={`${book}-${chapter}-${idx}`}
                          content={
                            <div
                              style={
                                dataTag &&
                                dataTag[0] &&
                                dataTag.find((content: any) => {
                                  return (
                                    `${content.version}-${content.book}-${content.chapter}-${content.verse}` ==
                                    `${version}-${book}-${chapter}-${idx}`
                                  );
                                }) && {
                                  width: "fit-content",
                                  color: theme == "dark" && "black",
                                  backgroundColor: dataTag.find(
                                    (content: any) =>
                                      `${content.version}-${content.book}-${content.chapter}-${content.verse}` ==
                                      `${version}-${book}-${chapter}-${idx}`,
                                  )?.colorTag,
                                }
                              }
                            >
                              <sup className="font-bold">{idx} </sup>
                              {getBibleVersion(version)[book]?.[chapter]?.[idx]}
                            </div>
                          }
                          id={`${book}-${chapter}-${idx}`}
                          other={{
                            version,
                            book: book,
                            chapter,
                            verset: idx,
                            description:
                              getBibleVersion(version)[book]?.[chapter]?.[idx],
                          }}
                          session={session}
                          setColor={setColor}
                          setOpen={setOpen}
                          setVerset={setVerset}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
