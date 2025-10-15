"use client";

import { useState } from "react";
import { Button } from "@heroui/button";

import {
  countChapters,
  getChapter,
} from "@/app/lib/actions/bible/bible.json.api";
interface TypeState {
  id: number;
  chapter: string;
  text: string;
}
export default function BibleClienPageTest() {
  const [versesRange, setVerseRange] = useState<TypeState[]>([]);
  const [c, setC] = useState<number>(0);

  const handleFindVeser = async () => {
    const find = await getChapter("lsg", "1", "1");
    const count = await countChapters("lsg", "1");

    if (find) {
      setVerseRange(find);
      setC(count);
    }
  };

  return (
    <div>
      <Button onClick={handleFindVeser}>Click</Button>
      {versesRange.map((item) => {
        return (
          <div key={item.id} className="flex">
            <p>{item.id}.</p>
            <p>{item.text}</p>
          </div>
        );
      })}
      <p className="text-2xl">{c}</p>
    </div>
  );
}
