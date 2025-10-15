"use client";

import React from "react";
import { Button } from "@heroui/button";

import { ContentDayPlan } from "@/app/lib/config/interface";

interface IndicatorDayProps {
  number_days: number;
  planId: number;
  dayCreatedInPlan: ContentDayPlan[];
  SetDayCreatedInPlant: React.Dispatch<React.SetStateAction<ContentDayPlan[]>>;
}
// const DAYS_PER_PAGE = 10;

export default function IndicatorDayCreated({
  number_days,
  dayCreatedInPlan,
}: IndicatorDayProps) {
  // const [currentPage, setCurrentPage] = useState(0);
  // const totalPages = Math.ceil(number_days / DAYS_PER_PAGE);

  // const handleNextPage = () => {
  //   if (currentPage < totalPages - 1) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 0) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const startIndex = currentPage * DAYS_PER_PAGE;
  // const endIndex = Math.min(startIndex + DAYS_PER_PAGE, number_days);

  return (
    <div className="flex gap-2">
      {Array.from({ length: number_days }).map((_, i) => {
        const isCreated = dayCreatedInPlan.find((d) => d.day === i + 1)
          ? true
          : false;
        const isUpdated = dayCreatedInPlan.find(
          (d) => d.createdAt !== d.updatedAt,
        )
          ? true
          : false;

        return (
          <div key={i}>
            <Button
              isIconOnly
              color={
                isCreated ? (isUpdated ? "warning" : "success") : "default"
              }
              size="sm"
            >
              {i + 1}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
