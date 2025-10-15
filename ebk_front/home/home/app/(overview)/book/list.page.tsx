"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Session } from "next-auth";

import { VideoPaginated } from "@/app/lib/config/interface";
import { CardBookFileUI } from "@/ui/card/card.ui";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ListeBooks({
  initData,
  session,
}: {
  initData: VideoPaginated | undefined | null;
  session: Session | null;
}) {
  const [book] = useState<VideoPaginated | null | undefined>(initData);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 xs:grid-cols-2 gap-4 mt-4">
      <Suspense fallback={"loading"}>
        {book?.items.map((item) => (
          <CardBookFileUI
            key={`${item.id}${item.createdAt}book`}
            book={item}
            session={session}
          />
        ))}
      </Suspense>
    </section>
  );
}

export function BookSuggestion({
  books,
  session,
}: {
  books: VideoPaginated;
  session: Session | null;
}) {
  const [book, setBooks] = useState<VideoPaginated>(books);

  const handleFindBook = useCallback(() => {
    if (books?.items) {
      const randomizedBooks = shuffleArray(books.items).slice(0, 8);

      setBooks((prev) => ({ ...prev, items: randomizedBooks }));
    }
  }, [books]);

  useEffect(() => {
    handleFindBook();

    // 🔄 Change l'ordre toutes les 30 secondes
    const interval = setInterval(() => {
      handleFindBook();
    }, 30000);

    return () => clearInterval(interval);
  }, [handleFindBook]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4  sm:grid-cols-3 xs:grid-cols-2 gap-4 mt-4">
      {book &&
        book.items.map((item) => (
          <CardBookFileUI
            key={`${item.id}${item.createdAt}book`}
            book={item}
            session={session}
          />
        ))}
    </section>
  );
}
