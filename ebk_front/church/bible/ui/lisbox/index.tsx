"use client";

import { MdForum } from "react-icons/md";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Listbox, ListboxItem } from "@heroui/listbox";

import { IconWrapper } from "../icons";

export function ListBoxForum({ forum }: { forum: any[] }) {
  return (
    <Listbox
      aria-label="User Menu"
      className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
      }}
    >
      {forum ? (
        forum?.map((item: any) => (
          <ListboxItem
            key="home"
            endContent={<ItemCounter number={item.subjectForum.length} />}
            href={`/church/forum/${item.id}`}
            startContent={
              <IconWrapper className="bg-success/10 text-success">
                <MdForum className="text-lg " />
              </IconWrapper>
            }
          >
            {item.title}
          </ListboxItem>
        ))
      ) : (
        <></>
      )}
    </Listbox>
  );
}

export function ListBoxSubjectForum({
  subjectForum,
  subjectForumSelected,
  setSubjectForumselected,
}: {
  subjectForum: any[];
  subjectForumSelected: any;
  setSubjectForumselected: any;
}) {
  return (
    <Listbox
      aria-label="Dynamic Actions"
      className="sticky p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
      }}
    >
      {subjectForum.map((item: any) => (
        <ListboxItem
          key={`${item.createdAt.toString()}`}
          className={"font-semibold text-2xl"}
          color={subjectForumSelected.id === item.id ? "primary" : "default"}
          onClick={() => {
            setSubjectForumselected(item);
          }}
        >
          {item.title}
        </ListboxItem>
      ))}
    </Listbox>
  );
}

export const ItemCounter = ({ number }: { number: number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{number}</span>
    <ChevronRightIcon className="text-xl" />
  </div>
);
