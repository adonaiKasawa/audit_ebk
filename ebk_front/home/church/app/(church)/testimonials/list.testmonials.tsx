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
  const [selected, setSelected] = useState<string | number>("approved");
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
      <h1 className="text-3xl">Témoignages</h1>
        <div className="my-4">
        <AddTestmonialsFormModal
          id_eglise={session.user.eglise.id_eglise}
          handleFindTesTmonials={handleFindTestmonials}
          setSelectedTab={(tab: string) => setSelected(tab)} // <- changement automatique du tab
        />
      </div>
      <div className="flex mt-4 mb-4">
        <Tabs
          aria-label="Tabs variant"
          selectedKey={selected}
          variant={"underlined"}
          onSelectionChange={(k) => {
            setSelected(k);
          }}
        >

          <Tab key="approved" title={`Approuver ${totalTesmonial?.approved}`} />
          <Tab key="pending" title={`En attente ${totalTesmonial?.pending}`} />
          <Tab key="dismiss" title={`Rejeter ${totalTesmonial?.dismiss}`} />
        </Tabs>
      </div>
      <div className="grid grid-cols-4 gap-4">
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
