import { Session } from "next-auth";

import { BibleStudyPaginated } from "@/app/lib/config/interface";
import { CardBibleStudyUI } from "@/ui/card/card.ui";

export function ListeBibleStudy({
  initData,
}: {
  initData: BibleStudyPaginated;
  session: Session | null;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {initData.items &&
        initData.items.map((item) => (
          <CardBibleStudyUI key={`${item.createdAt}`} bibleStudy={item} />
        ))}
    </div>
  );
}
