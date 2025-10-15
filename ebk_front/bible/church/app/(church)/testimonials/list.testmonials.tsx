"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Session } from "next-auth";
import { Tabs, Tab } from "@heroui/tabs";

import {
  ItemTesmonial,
  TestmonialsPaginated,
} from "@/app/lib/config/interface";
import TesmonialPlayerUI from "@/ui/testmonials/player.testmonials.ui";
import { TestimonialStatusEnum, TypeContentEnum } from "@/app/lib/config/enum";
import { findFilesByChurchPaginatedApi } from "@/app/lib/actions/library/library";
import { createTestmonial } from "@/app/lib/actions/testmonial/testmonial.req";
import { Camera, Upload } from "lucide-react";
import { Button } from "@heroui/button";
import AddTestmonialsFormModal from "@/ui/modal/form/testmonial";

export default function ListeTestmonials({
  session,
  initData,
}: {
  session: Session;
  initData: TestmonialsPaginated;
}) {
  const [testimonials, setTesmonials] = useState<ItemTesmonial[]>(
    initData.items,
  );

  const [selected, setSelected] = useState<string | number>("pending");
  const [, setPending] = useState<boolean>(false);
  const [totalTesmonial, setTotalTestmonial] = useState<{
    pending: number;
    approved: number;
    dismiss: number;
  }>({
    pending: 0,
    approved: 0,
    dismiss: 0,
  });

  const countTestmonial = useCallback(() => {
    const approved = testimonials.filter(
      (item) => item.status === TestimonialStatusEnum.ACTIVE,
    ).length;
    const dismiss = testimonials.filter(
      (item) => item.status === TestimonialStatusEnum.INACTIVE,
    ).length;
    const pending = testimonials.filter(
      (item) => item.status === TestimonialStatusEnum.PENDING,
    ).length;

    setTotalTestmonial({ approved, dismiss, pending });
  }, [testimonials]);

  const handleFindTestmonials = async () => {
    setPending(true);
    const req = await findFilesByChurchPaginatedApi(
      TypeContentEnum.testimonials,
      session.user.eglise.id_eglise,
    );

    setPending(false);
    if (!req.hasOwnProperty("statusCode") && !req.hasOwnProperty("message")) {
      setTesmonials(req.items);
      
      
    }
  };

  useEffect(() => {
    countTestmonial();
  }, [countTestmonial]);

  return (
    <div>
      <div className="block sm:flex justify-between items-center">
        <h1 className="text-3xl mb-4 sm:mb-0">Témoignages</h1>
        <AddTestmonialsFormModal
          id_eglise={session.user.eglise.id_eglise}
          handleFindTesTmonials={handleFindTestmonials}
        />
      </div>
      <div className="flex flex-col sm:flex-row mt-4 mb-4 ">
        <Tabs
          aria-label="Tabs variant"
          selectedKey={selected}
          variant={"underlined"}
          className="w-full"
          onSelectionChange={(k) => {
            setSelected(k);
          }}

        >
          <Tab key="pending" title={`En attente ${totalTesmonial?.pending}`} className="w-full sm:w-auto" />
          <Tab key="approved" title={`Approuver ${totalTesmonial?.approved}`}  className="w-full sm:w-auto"/>
          <Tab key="dismiss" title={`Rejeter ${totalTesmonial?.dismiss}`} className="w-full sm:w-auto" />
        </Tabs>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {testimonials.map(
          (item) =>
            item.status === selected && (
              <TesmonialPlayerUI
                key={`${item.createdAt}-${item.id}`}
                handleFindTestmonials={handleFindTestmonials}
                session={session}
                testmonial={item}
              />
            ),
        )}
      </div>
    </div>
  );
}
