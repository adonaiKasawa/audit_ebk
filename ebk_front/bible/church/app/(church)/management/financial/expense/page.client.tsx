"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Session } from "next-auth";
// import {
//   CalendarDate,
//   CalendarDateTime,
//   parseDate,
//   ZonedDateTime,
// } from "@internationalized/date";
import moment from "moment";
import { Card } from "@heroui/card";

import { ManagementExpenses } from "@/app/lib/config/interface";
import FinanceExpenseSsrTableUI from "@/ui/table/finance/expense/finance.expense.ssr.table";

export default function ManangmentIncomePageClient({
  initData,
  session,
}: {
  session: Session;
  initData: ManagementExpenses[];
}) {
  // const dte = moment().format("YYYY-MM-DD").toString();
  const [totaleIncome, setTotaleIncome] = useState<number>(0);
  const [totaleInMonth, setTotaleInMonth] = useState<number>(0);
  // const [dateBigin] = useState<
  //   CalendarDateTime | ZonedDateTime | CalendarDate | null | undefined
  // >(parseDate(dte));
  // const [dateEnd] = React.useState<
  //   CalendarDateTime | ZonedDateTime | CalendarDate | null | undefined
  // >(parseDate(dte));

  // const handelFilteByDate = () => {
  //   let income = 0;
  //   let income_d = 0;
  //   let startDate = moment(dateBigin?.toString());
  //   let endDate = moment(dateEnd?.toString());

  //   initData.map((item) => {
  //     income += item.amount;
  //     if (moment(item.createdAt).isBetween(startDate, endDate)) {
  //       income_d += item.amount;
  //     }
  //   });
  //   setTotaleIncome(income);
  //   setTotaleInMonth(income_d);
  // };

  const handelIntialeFilter = useCallback(() => {
    let income = 0;
    let income_d = 0;
    let format = moment().format("YYYY-MM");

    initData.map((item) => {
      income += item.amount;
      if (moment(item.createdAt).format("YYYY-MM") === format) {
        income_d += item.amount;
      }
    });
    setTotaleIncome(income);
    setTotaleInMonth(income_d);
  }, [initData]);

  useEffect(() => {
    handelIntialeFilter();
  }, [handelIntialeFilter]);

  return (
    <div>
      <h1 className="text-2xl">Dépense</h1>
      {/* <div className="flex gap-4 items-center mt-4">
        <DatePicker
          fullWidth
          size="sm"
          variant="bordered"
          className="max-w-[284px]"
          label="Date de debut"
          value={dateBigin}
          onChange}
        />
        <DatePicker
          fullWidth
          size="sm"
          variant="bordered"
          className="max-w-[284px]"
          label="Date de fin"
          value={dateEnd}
          onChange={setDateEnd}
        />
        <Button onClick={handelFilteByDate} size="sm" isIconOnly className="bg-foreground">
          <SearchIcon className="text-background text-2xl" />
        </Button>
        <Button onClick={handelIntialeFilter} size="sm" isIconOnly className="bg-foreground">
          <IoReload size={30} className="text-background" />
        </Button>
      </div> */}
      <div className="flex items-center gap-4 mt-4">
        <Card className="p-4">
          <p className="text-xl font-medium">Total de Dépense</p>
          <p className="text-xl font-medium">$ {totaleIncome}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xl font-medium">Dépense de ce mois</p>
          <p className="text-xl font-medium">$ {totaleInMonth}</p>
        </Card>
      </div>
      <FinanceExpenseSsrTableUI initData={initData} session={session} />
    </div>
  );
}
