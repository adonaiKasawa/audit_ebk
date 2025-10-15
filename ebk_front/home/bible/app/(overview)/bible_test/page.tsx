"use server";

import BibleClienPageTest from "./page.client";

export default async function Page() {
  // const verser = await getVerse("lsg", "1", "2", "2");
  // const verser1 = await getVerse("lsg", "2", "1", "1");
  // const verser2 = await getVerse("lsg", "1", "1", "2");
  // const verser3 = await getVerse("lsg", "1", "1", "1");
  // const verser4 = await getVerse("lsg", "3", "2", "1");

  return (
    <div>
      <BibleClienPageTest />
    </div>
  );
}
