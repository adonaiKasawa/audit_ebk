"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Session } from "next-auth";
import { Selection, SortDescriptor } from "@react-types/shared";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Image } from "@heroui/image";

import DialogAction from "../../modal/dialog";
import Alert from "../../modal/alert";
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "../../icons";

import { columns } from "./data";

import { capitalize } from "@/app/lib/config/func";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { ItemPicture, PicturePaginated } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import {
  DeleteFile,
  findFilesByChurchPaginatedApi,
} from "@/app/lib/actions/library/library";
import {
  AddPictureFormModal,
  UpdatePictureFormModal,
} from "@/ui/modal/form/picture";

const INITIAL_VISIBLE_COLUMNS = [
  "lien",
  "description",
  "vue",
  "like",
  "comment",
  "actions",
];

export default function PictureSsrTableUI({
  initData,
  session,
}: {
  session: Session;
  initData: PicturePaginated;
}) {
  const [pictures, setPictures] = useState<ItemPicture[]>(initData.items);
  const [day, setDay] = useState<any[]>([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(pictures.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPictures = [...pictures];

    if (hasSearchFilter) {
      filteredPictures = filteredPictures.filter((picture) =>
        picture.descrition.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredPictures;
  }, [pictures, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof ItemPicture] as number;
      const second = b[sortDescriptor.column as keyof ItemPicture] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (picture: ItemPicture, columnKey: React.Key) => {
      switch (columnKey) {
        case "lien":
          return (
            <div>
              <Avatar
                alt={`${picture.createdAt}`}
                className="object-center rounded-md"
                fallback={
                  <Image height={100} src="./ecclessia.png" width={200} />
                }
                src={`${file_url}${picture.photos[0]}`}
                style={{ width: 200, height: 100 }}
              />
              <div className="absolute top-1 left-1 p-1 rounded-md bg-default">
                <p className=" text-foreground">{picture.photos.length}</p>
              </div>
            </div>
          );
        case "description":
          return <p>{picture.descrition} </p>;
        case "like":
          return <p>{picture.favoris.length}</p>;
        case "comment":
          return <p>{picture.commentaire.length}</p>;
        case "actions":
          return (
            <ActionPictures
              handleFindPictures={handleFindPictures}
              picture={picture}
              pictures={pictures}
              setPictures={setPictures}
            />
          );
        default:
          return <></>;
      }
    },
    [],
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleFindPictures = async () => {
    if (session) {
      const find = await findFilesByChurchPaginatedApi(
        TypeContentEnum.images,
        session.user.eglise.id_eglise,
      );

      if (find) {
        setPictures(find.items);
      }
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Rechercher par date..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="none"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <AddPictureFormModal handleFindPictures={handleFindPictures} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {pictures.length} picture
          </span>
          <label className="flex items-center text-default-400 text-small">
            Lignes par page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    day,
    setDay,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "Tous les éléments séléctionné"
            : `${selectedKeys.size} à ${items.length} sélectionné`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper:
            "max-h-[382px] after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      isCompact={false}
      selectedKeys={selectedKeys}
      selectionMode="none"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Pas d'images disponibles."} items={sortedItems}>
        {(item: ItemPicture) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export const ActionPictures = ({
  picture,
  handleFindPictures,
}: {
  picture: ItemPicture;
  setPictures: Dispatch<SetStateAction<ItemPicture[]>>;
  pictures: ItemPicture[];
  handleFindPictures: () => void;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleDeletePictures = async () => {
    const update = await DeleteFile(picture.id, TypeContentEnum.images);

    if (
      update.hasOwnProperty("statusCode") &&
      update.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof update.message === "object") {
        let message = "";

        update.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    } else {
      handleFindPictures();
      setOpenModal(false);
      setOpenAlert(true);
      setAlertTitle("Suppression réussi");
      setAlertMsg("La suppresion des images a réussi.");
    }
  };

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown className="bg-background border-1 border-default-200">
        <DropdownTrigger>
          <Button isIconOnly radius="full" size="sm" variant="light">
            <VerticalDotsIcon className="text-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key={"update"}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Modifier
          </DropdownItem>
          <DropdownItem
            key={"delete"}
            onClick={() => {
              setOnBloqued(true);
            }}
          >
            Supprimer
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={alertTitle}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
      <DialogAction
        action={handleDeletePictures}
        dialogBody={<p>Étes-vous sure de vouloir supprimer cette image?</p>}
        dialogTitle={"Avertissement !"}
        isOpen={onBloqued}
        onClose={() => {
          setOnBloqued(false);
        }}
        onOpen={() => {
          setOnBloqued(true);
        }}
      />
      <UpdatePictureFormModal
        handleFindPictures={handleFindPictures}
        openModal={openModal}
        picture={picture}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};
