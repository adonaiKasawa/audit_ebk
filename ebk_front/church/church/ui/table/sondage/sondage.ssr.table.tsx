"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import { QuestionnairesSondage } from "@/app/lib/config/interface";
import { sondageQuestionType } from "@/ui/modal/form/sondageQst";

export default function SondageQuestionTableUI({
  initData,
}: {
  initData: QuestionnairesSondage[];
}) {
  return (
    <Table removeWrapper aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>#</TableColumn>
        <TableColumn>Question</TableColumn>
        <TableColumn>Type</TableColumn>
      </TableHeader>
      <TableBody>
        {initData.map((item, i) => {
          const type = sondageQuestionType.find((e) => e.key === item.type);

          return (
            <TableRow key={item.id}>
              <TableCell>QST-{i + 1}</TableCell>
              <TableCell>{item.question}</TableCell>
              <TableCell>{type?.value}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
