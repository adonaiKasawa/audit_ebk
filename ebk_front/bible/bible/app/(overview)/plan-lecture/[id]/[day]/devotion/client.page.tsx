"use client";

import React from "react";
import "swiper/css";
import { Session } from "next-auth";
import { FiChevronRight } from "react-icons/fi";
import { Button } from "@heroui/button";
import Link from "next/link";

import {
  ContentDayPlan,
  ItemBiblePlanLecture,
} from "@/app/lib/config/interface";
import PlanInfoComponent from "@/components/plan_info";

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

export default function DevotionPage({
  params,
  initData,
  contentDays,
}: {
  params: { id: string; day: number };
  contentDays: ContentDayPlan[];
  initData: ItemBiblePlanLecture;
  session: Session | null;
}) {
  function getFrom(contents: ContentDayPlan[]) {
    return contents.length || 0;
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
      <div className="min-h-fit flex items-center  max-w-2xl mx-auto justify-center">
        <div className="mx-auto p-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-base text-justify md:text-lg lg:text-xl">
              {contentDays.find((c) => c.day == params.day)?.devotion}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex items-center justify-center">
        <Link
          href={`/plan-lecture/${params.id}/${params.day}/${contentDays.find((c) => c.day == params.day)?.contents[0].id || 1}`}
        >
          <Button
            className="px-4 py-2 rounded-full text-white"
            endContent={<FiChevronRight />}
          >
            Suivant
          </Button>
        </Link>
      </div>
    </>
  );
}
