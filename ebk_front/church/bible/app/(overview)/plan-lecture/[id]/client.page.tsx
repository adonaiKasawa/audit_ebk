"use client";

import React, { useCallback, useEffect, useState } from "react";
import "swiper/css";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import Link from "next/link";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { Image } from "@heroui/image";

import books from "@/lib/bible_book";
import {
  ContentDayPlan,
  ItemBiblePlanLecture,
} from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";

export default function ClienViewPlanLecture({
  params,
  initData,
  contentDays,
}: {
  params: { id: string };
  contentDays: ContentDayPlan[];
  initData: ItemBiblePlanLecture;
  session: Session | null;
  findPlanStart: {
    createdAt: string;
    plans: ItemBiblePlanLecture;
  }[];
}) {
  const { id } = params;
  const [daySelect, setDaySelect] = useState(1);
  const [contentDaySelected, setContentDaySeleted] = useState<ContentDayPlan>();
  const pathname = usePathname();
  // const days = Array.from({ length: 21 }, (_, i) => i + 1);

  const handleChangeDayAndContentDay = useCallback(
    (d: number) => {
      setDaySelect(d);
      const find = contentDays.find((e) => e.day === d);

      setContentDaySeleted(find);
    },
    [contentDays],
  );

  useEffect(() => {
    handleChangeDayAndContentDay(1);
  }, [handleChangeDayAndContentDay]);

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <Link
          className="flex items-center mb-4"
          href={
            pathname.includes("church")
              ? "/church/plan-lecture"
              : "/plan-lecture"
          }
        >
          <FiArrowLeft size={20} />
          <p className="text-sm text-gray-500"> Mes plans</p>
        </Link>

        <Card className="mt-4">
          <CardHeader>
            <div>
              <Image
                alt="Plan image"
                height={140}
                src={`${
                  initData.picture
                    ? file_url + initData.picture
                    : `./ecclessia.png`
                }`}
                width={200}
              />
              <h1 className="text-2xl font-bold">{initData.title}</h1>
              <p className="text-gray-500 mb-4">
                Jour 1 sur {contentDays.length}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex overflow-x-auto">
              {Array.from({ length: contentDays.length }, (v, i) => i + 1).map(
                (day) => (
                  <button
                    key={day}
                    className="flex-shrink-0 mx-1"
                    onClick={() => {
                      handleChangeDayAndContentDay(day);
                    }}
                  >
                    <span
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${day === daySelect ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"}`}
                    >
                      {day}
                    </span>
                  </button>
                ),
              )}
            </div>
            {contentDaySelected && (
              <div className="mt-4">
                {contentDaySelected.devotion != null &&
                  contentDaySelected.devotion.trim() !== "" && (
                    <Link href={`${id}/${daySelect}/devotion`}>
                      <div
                        className="flex items-center justify-between"
                        style={{ alignItems: "center", padding: 10 }}
                      >
                        <span className="text-lg font-medium">Méditation</span>
                        <Button
                          className="px-4 py-2 rounded-full bg-black text-white"
                          endContent={<FiChevronRight />}
                        >
                          Lire
                        </Button>
                      </div>
                    </Link>
                  )}
                {contentDaySelected.contents.map((content, i) => (
                  <div key={i}>
                    <Divider />
                    <Link
                      href={`/plan-lecture/${id}/${daySelect}/${content.id}`}
                    >
                      <div
                        className="flex items-center justify-between mt-4"
                        style={{ alignItems: "center", padding: 10 }}
                      >
                        <span className="text-lg font-medium">
                          {`
                            ${books.find((b) => b.Numero == parseInt(content.book))?.Nom}
                            ${content.chapter}${content.verse != null ? `:${content.verse}` : ""}
                          `}
                        </span>
                        <FiChevronRight size={30} />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
