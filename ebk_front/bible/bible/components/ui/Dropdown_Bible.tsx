import { HiDotsHorizontal } from "react-icons/hi";
import { FaHistory } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa6";
import { Button } from "@heroui/button";
import { Card, CardHeader } from "@heroui/card";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

export function DropdownBible({
  setComponent,
  title,
}: {
  title: string;
  setComponent: any;
}) {
  return (
    <Card className="bg-primary">
      <CardHeader style={{ justifyContent: "center" }}>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light">
              <HiDotsHorizontal className="cursor-pointer" />{" "}
              <p className="capitalize">{title}</p>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="liked"
              className="flex"
              startContent={
                <FaHashtag
                  className="cursor-pointer"
                  color={"primary"}
                  size={20}
                />
              }
              onClick={() => {
                setComponent("tag");
              }}
            >
              Tag
            </DropdownItem>
            <DropdownItem
              key="response"
              startContent={
                <FaHistory
                  className="cursor-pointer"
                  color={"primary"}
                  size={20}
                />
              }
              onClick={() => {
                setComponent("historique");
              }}
            >
              Historique
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
    </Card>
  );
}
