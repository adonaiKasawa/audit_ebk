import React, { useState, useEffect } from "react";
import { Session } from "next-auth";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";

import Menu from "./menu";

import { bibleVersionsCompare, getBibleVersion } from "@/lib/utils";
import { otherInterface } from "@/app/lib/config/interface";

const colorTag = [
  {
    name: "Rouge",
    hexa: "#F5F5DC",
  },
  {
    name: "Vert",
    hexa: "#90EE90",
  },
  {
    name: "Bleu",
    hexa: " #ADD8E6",
  },
  { name: "Jaune", hexa: "#FFFFE0" },
];

const MenuContext = ({
  id,
  content,
  other,
  session,
  setOpen,
  setColor,
  setVerset,
}: {
  id: string;
  content: any;
  other: otherInterface;
  session: Session | null;
  setOpen: any;
  setColor: any;
  setVerset: any;
}) => {
  const [versionSelect, setVersionSelect] = useState<string[]>([
    "lsg",
    "dby",
    "kjf",
  ]);
  const { book, chapter, verset } = other;
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClick = () => setClicked(false);

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setClicked(true);
          setPoints({
            x: e.pageX,
            y: e.pageY,
          });
        }}
      >
        <Menu key={id} title={content} />
      </div>
      {clicked && (
        <Card
          className="absolute w-68 rounded-md"
          style={{ top: points.y, left: points.x }}
        >
          <ul className="list-none p-2 m-0">
            <li className="px-3 py-2 hover:bg-black flex">
              {session?.user &&
                colorTag.map(
                  (color: { hexa: string; name: string }, key: number) => (
                    <button
                      key={key}
                      className="cursor-pointer"
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: color.hexa,
                        border: "1px solid black",
                        marginRight: 5,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        setColor(color.hexa);
                        setOpen(true);
                        setVerset(verset);
                      }}
                    />
                  ),
                )}
            </li>
            <div>
              <Accordion>
                <AccordionItem
                  key="1"
                  aria-label="Accordion 1"
                  title="Voir dans d'autre version"
                >
                  <Select
                    className="max-w-xs"
                    defaultSelectedKeys={["lsg", "dby", "kjf"]}
                    label="Sélectionner vos versions"
                    placeholder="Sélectionner une version"
                    selectionMode="multiple"
                    onChange={({ target }: { target: any }) => {
                      const regex = new RegExp(",");
                      const { value } = target;

                      if (regex.test(value)) {
                        setVersionSelect(value.split(","));
                      } else {
                        setVersionSelect([value]);
                      }
                    }}
                  >
                    {bibleVersionsCompare.map((version) => (
                      <SelectItem key={version.code}>{version.name}</SelectItem>
                    ))}
                  </Select>
                  {versionSelect.map((code: string) => {
                    if (["", undefined].includes(code)) return null;

                    return (
                      <Card key={code} className="p-2 mb-1 shadow-sm">
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-1 capitalize">
                            {
                              bibleVersionsCompare.find(
                                (ver) => ver.code == code,
                              )?.name
                            }
                          </h3>
                          <p className="capitalize">
                            {getBibleVersion(code)[book]?.[chapter]?.[verset]}
                          </p>
                        </CardBody>
                      </Card>
                    );
                  })}
                </AccordionItem>
              </Accordion>
            </div>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default MenuContext;
