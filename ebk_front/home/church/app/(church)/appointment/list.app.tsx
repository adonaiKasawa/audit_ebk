"use client";

import SsrTableUI from "@/ui/table/appointment/ssr.table";

export function ListAppointement({ appointement }: { appointement: any }) {
  return (
    <div className="">
      <div className="flex justify-between">
        <h1 className="text-3xl">Rendez-vous</h1>
      </div>
      <div>
        <SsrTableUI initAppointement={appointement} />
      </div>
    </div>
  );
}
