import React from "react";
import { Session } from "next-auth";

import TesmonialPlayerUI from "../testmonials/player.testmonials.ui";

export default function Temoignages({
  testimonials,
  session,
}: {
  testimonials: any[];
  session: Session | null;
}) {
  const handleFindTestmonials = async () => {};

  return (
    <div>
      {testimonials.map((item, i) => (
        <TesmonialPlayerUI
          key={i}
          handleFindTestmonials={handleFindTestmonials}
          session={session}
          testmonial={item}
        />
      ))}
    </div>
  );
}
