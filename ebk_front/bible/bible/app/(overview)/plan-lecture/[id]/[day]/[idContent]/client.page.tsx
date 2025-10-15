"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Session } from "next-auth";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FiAlignCenter } from "react-icons/fi";
import { FiAlignJustify } from "react-icons/fi";
import { FiAlignLeft } from "react-icons/fi";
import { FiAlignRight } from "react-icons/fi";
import { FaParagraph } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { colors } from "@heroui/theme";

import { versions } from "@/lib/version";
import books from "@/lib/bible_book";
import {
  getChapter,
  getVersesRange,
} from "@/app/lib/actions/bible/bible.json.api";
import { getVerse } from "@/app/lib/services/api/bible.api";
import PlanInfoComponent from "@/components/plan_info";
import {
  ContentDayPlan,
  ItemBiblePlanLecture,
} from "@/app/lib/config/interface";

// const filter = [
//   "Louange",
//   "Adoration",
//   "Prière",
//   "Culte",
//   "Prophétie",
//   "Témoignage",
//   "Délivrances",
//   "Fois",
//   "Pardon",
//   "Bénédiction",
// ];

const checkStringType = (value: string): number => {
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

export default function ContentPage({
  params,
  initData,
  contentDays,
}: {
  params: { id: string; day: number; idContent: number };
  contentDays: ContentDayPlan[];
  initData: ItemBiblePlanLecture;
  session: Session | null;
}) {
  const { idContent } = params;
  const [version, setVersion] = useState("lsg");
  const [contentView, setContentView] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [alignText, setAlignText] = useState<string>("left");
  const [paragraph, setParagraph] = useState<boolean>(true);
  // const [endPlan, setEndPlan] = useState(false);

  const contentGet = useMemo(() => {
    return (
      contentDays
        .find((c) => c.day == params.day)
        ?.contents.find((f) => f.id == params.idContent) || {
        verse: "1",
        book: "1",
        chapter: "1",
      }
    );
  }, [contentDays, params]);

  const getView = useCallback(async () => {
    let response: any;

    if (contentGet !== null && contentGet.verse !== null) {
      setLoading(true);
      if (checkStringType(contentGet?.verse) == 2)
        response = await getVerse(
          version,
          `${contentGet.book}`,
          `${contentGet.chapter}`,
          `${contentGet.verse}`,
        );

      if (checkStringType(contentGet?.verse) == 0)
        response = await getChapter(
          version,
          `${contentGet.book}`,
          `${contentGet.chapter}`,
        );

      if (checkStringType(contentGet?.verse) == 1)
        response = await getVersesRange(
          version,
          `${contentGet.book}`,
          `${contentGet.chapter}`,
          parseInt(contentGet.verse.split("-")[0]) || 1,
          parseInt(contentGet.verse.split("-")[1]) || 1,
        );

      setContentView(response);
      setLoading(false);
    } else if (contentGet !== null && contentGet.chapter !== null) {
      setLoading(true);
      response = await getChapter(
        version,
        `${contentGet.book}`,
        `${contentGet.chapter}`,
      );
      setContentView(response);
      setLoading(false);
    }
  }, [contentGet, version]);

  function getFrom(contents: ContentDayPlan[]) {
    let from = 0;

    for (let i = 0; i < contents.length; i++) {
      if (contents[i].day == params.day) {
        const element = contents[i].contents;

        for (let f = 0; f < element.length; f++) {
          const data = element[f];

          if (data.id == params.idContent) from = f + 1;
        }
      }
    }

    return from;
  }

  function getTo(contents: ContentDayPlan[]) {
    let to = 0;

    for (let i = 0; i < contents.length; i++) {
      if (contents[i].day == params.day) {
        const element = contents[i].contents;

        to = element.length;
      }
    }

    return to;
  }

  function getLinkToGo(
    contentDays: ContentDayPlan[],
    direction: "next" | "prev" = "next",
  ) {
    const contentDay = contentDays.find((d) => d.day == params.day)?.contents;

    if (contentDay) {
      const findContentIndexOf = contentDay.findIndex((c) => c.id == idContent);

      const findDayIndexOf = contentDays.findIndex(
        (c) =>
          c.day === (direction === "next" ? params.day + 1 : params.day - 1),
      );
      const nextDay = contentDays[findDayIndexOf];
      const nextContent =
        contentDay[
          direction === "next" ? findContentIndexOf + 1 : findContentIndexOf - 1
        ];

      // console.log(
      //   contentDays,
      //   nextDay,
      //   contentDay,
      //   contentDays.find((d) => d.day == params.day),
      // );

      if (nextContent)
        return `/plan-lecture/${params.id}/${params.day}/${nextContent.id}?nextContent=nextContent`;

      if (nextDay)
        return `/plan-lecture/${params.id}/${nextDay.day}/${nextDay.contents[0].id}?nextDay=nextDay`;

      if (findContentIndexOf)
        return `/plan-lecture/${params.id}/${params.day}/${idContent}?findContentIndexOf=findContentIndexOf`;

      if (!nextDay) {
        return "/plan-lecture";
      }
    }
  }

  useEffect(() => {
    getView();
  }, [getView, version]);

  return (
    <>
      <PlanInfoComponent
        PlanLecture={initData}
        content={{
          from: getFrom(contentDays),
          to: getTo(contentDays),
        }}
        contentDay={contentDays.length}
        contents={contentDays.find((c) => c.day == params.day)}
        day={params.day}
      />
      <div className="min-h-fit flex flex-col max-w-3xl mx-auto mt-4">
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-medium">
            {`${
              books.find((b) => b.Numero == parseInt(contentGet.book))?.Nom
            }  ${contentGet.chapter}`}
          </p>
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
                {data.name}
                {data.type == "fr"
                  ? " Version francaise"
                  : data.type == "en"
                    ? " Version anglais"
                    : "Autre"}
              </SelectItem>
            ))}
          </Select>
          <div className="flex gap-2 items-center">
            <Button
              isIconOnly
              color={alignText === "center" ? "primary" : "default"}
              onClick={() => {
                setAlignText("center");
              }}
            >
              <FiAlignCenter
                color={alignText === "center" ? "white" : "default"}
                size={24}
              />
            </Button>
            <Button
              isIconOnly
              color={alignText === "justify" ? "primary" : "default"}
              onClick={() => {
                setAlignText("justify");
              }}
            >
              <FiAlignJustify
                color={alignText === "justify" ? "white" : "default"}
                size={24}
              />
            </Button>
            <Button
              isIconOnly
              color={alignText === "left" ? "primary" : "default"}
              onClick={() => {
                setAlignText("left");
              }}
            >
              <FiAlignLeft
                color={alignText === "left" ? "white" : "default"}
                size={24}
              />
            </Button>
            <Button
              isIconOnly
              color={alignText === "right" ? "primary" : "default"}
              onClick={() => {
                setAlignText("right");
              }}
            >
              <FiAlignRight
                color={alignText === "right" ? "white" : "default"}
                size={24}
              />
            </Button>
            <p className="text-xl">|</p>
            <Button
              isIconOnly
              color={paragraph ? "primary" : "default"}
              onClick={() => {
                setParagraph(!paragraph);
              }}
            >
              <FaParagraph color={paragraph ? "white" : "default"} size={24} />
            </Button>
          </div>
        </div>
        <p className="my-4 text-center font-bold">
          {`${books.find((b) => b.Numero == parseInt(contentGet.book))?.Nom} 
        ${contentGet.chapter}${
          contentGet.verse != null ? `:${contentGet.verse}` : ""
        }`}
        </p>
      </div>
      {loading && contentView === "" ? (
        <div className="max-w-3xl flex flex-col  mx-auto  gap-2">
          <Skeleton className={`h-3 w-3/5 rounded-lg`} />
          <Skeleton className={`h-3 w-4/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <br />
          <Skeleton className={`h-3 w-3/5 rounded-lg`} />
          <Skeleton className={`h-3 w-4/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <br />
          <Skeleton className={`h-3 w-3/5 rounded-lg`} />
          <Skeleton className={`h-3 w-4/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
          <Skeleton className={`h-3 w-6/5 rounded-lg`} />
        </div>
      ) : (
        <div className="min-h-fit flex flex-col max-w-3xl mx-auto">
          {typeof contentView == "string" ? (
            <p className={`text-base text-${alignText} md:text-lg lg:text-xl`}>
              <sup style={{ color: "red" }}>{contentGet.verse}</sup>
              {contentView}
            </p>
          ) : (
            <>
              {paragraph ? (
                <p
                  className={`text-base text-${alignText} md:text-lg lg:text-xl`}
                >
                  {contentView.map((c: any, key: number) => (
                    <span key={key}>
                      <sup style={{ color: "red" }}>{c.id}</sup>
                      {c.text}
                    </span>
                  ))}
                </p>
              ) : (
                <>
                  {contentView.map((c: any, key: number) => (
                    <p
                      key={key}
                      className={`text-base text-${alignText} md:text-lg lg:text-xl`}
                    >
                      <sup style={{ color: "red" }}>{c.id}</sup>
                      {c.text}
                    </p>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
      <div className="flex  max-w-2xl mx-auto items-center justify-between mt-4">
        <Link href={getLinkToGo(contentDays, "prev") || "#"}>
          <Button
            className="px-16 py-8"
            radius="full"
            startContent={<FiChevronLeft size={24} />}
          >
            <p className="text-xl">
              {getLinkToGo(contentDays) == "/plan-lecture"
                ? "Voir d'autre plan de lecture"
                : "Retour"}
            </p>
          </Button>
        </Link>
        <Link href={getLinkToGo(contentDays) || "#"}>
          <Button
            className="px-16 py-8"
            color="primary"
            endContent={<FiChevronRight color={colors.white} size={24} />}
            radius="full"
          >
            <p className="text-xl text-white">
              {getLinkToGo(contentDays) == "/plan-lecture"
                ? "Voir d'autre plan de lecture"
                : "Suivant"}
            </p>
          </Button>
        </Link>
      </div>
    </>
  );
}
