"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Session } from "next-auth";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Selection, SortDescriptor } from "@react-types/shared";

import DialogAction from "../../modal/dialog";
import Alert from "../../modal/alert";
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "../../icons";

import { columns, statusOptions } from "./data";

import { capitalize } from "@/app/lib/config/func";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { file_url } from "@/app/lib/request/request";
import {
  DeleteFile,
  findFilesByChurchPaginatedApi,
} from "@/app/lib/actions/library/library";
import {
  ItemTesmonial,
  TestmonialsPaginated,
} from "@/app/lib/config/interface";
import AddTestmonialsFormModal from "@/ui/modal/form/testmonial";
import VideoThumbnail from "@/ui/VideoThumbnail";

// const statusColorMap: Record<string, ChipProps["color"]> = {
//   actif: "success",
//   inactif: "warning",
//   bloquer: "danger",
// };

const INITIAL_VISIBLE_COLUMNS = [
  "lien",
  "description",
  "vue",
  "like",
  "comment",
  "actions",
];

export default function TestmonialSsrTableUI({
  initData,
  session,
}: {
  session: Session;
  initData: TestmonialsPaginated;
}) {
  const [testmonials, setTestmonials] = useState<any>(initData.items);
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

  const [selectedTab, setSelectedTab] = useState<string>("temoignages");

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(testmonials.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredtesmonials = [...testmonials];

    if (hasSearchFilter) {
      filteredtesmonials = filteredtesmonials.filter(
        (membre) =>
          membre.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
          membre.prenom.toLowerCase().includes(filterValue.toLowerCase()) ||
          membre.telephone.toLowerCase().includes(filterValue.toLowerCase()) ||
          membre.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          `${membre.nom} ${membre.prenom}`
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          `${membre.prenom} ${membre.nom}`
            .toLowerCase()
            .includes(filterValue.toLowerCase()),
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredtesmonials = filteredtesmonials.filter((membre) =>
        Array.from(statusFilter).includes(membre.status),
      );
    }

    return filteredtesmonials;
  }, [testmonials, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof ItemTesmonial] as number;
      const second = b[sortDescriptor.column as keyof ItemTesmonial] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (testmonial: ItemTesmonial, columnKey: React.Key) => {
      switch (columnKey) {
        case "lien":
          return (
            <div>
              <VideoThumbnail
                snapshotAtTime={5}
                videoUrl={`${file_url}${testmonial.link}`}
              />
            </div>
          );
        case "description":
          return <p>{testmonial.description} </p>;
        case "vue":
          return <p>0 </p>;
        case "like":
          return <p>{testmonial.favoris.length}</p>;
        case "comment":
          return <p>{testmonial.commentaire.length}</p>;
        case "actions":
          return (
            <ActionTestMonials
              handleFindTesTmonials={handleFindTesTmonials}
              setTestmonials={setTestmonials}
              testmonial={testmonial}
              testmonials={testmonials}
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

  const handleFindTesTmonials = async () => {
    if (session) {
      const find = await findFilesByChurchPaginatedApi(
        TypeContentEnum.testimonials,
        session.user.eglise.id_eglise,
      );

      if (find) {
        setTestmonials(find.items);
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
            <AddTestmonialsFormModal
              handleFindTesTmonials={handleFindTesTmonials}
              id_eglise={session.user.eglise.id_eglise}
              setSelectedTab={setSelectedTab}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {testmonials.length} témoignages
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
      <TableBody emptyContent={"Aucun rendez-vous trouvé"} items={sortedItems}>
        {(item: ItemTesmonial) => (
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

export const ActionTestMonials = ({
  testmonial,
  handleFindTesTmonials,
}: {
  testmonial: ItemTesmonial;
  setTestmonials: Dispatch<SetStateAction<ItemTesmonial[]>>;
  testmonials: ItemTesmonial[];
  handleFindTesTmonials: () => void;
}) => {
  const [, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleDeletetesmonials = async () => {
    const update = await DeleteFile(
      testmonial.id,
      TypeContentEnum.testimonials,
    );

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
      handleFindTesTmonials();
      setOpenModal(false);
      setOpenAlert(true);
      setAlertTitle("Suppression réussi");
      setAlertMsg("La suppresion de la vidéos  a réussi.");
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
        action={handleDeletetesmonials}
        dialogBody={
          <p>Étes-vous sure de vouloir supprimer cette tesmonials?</p>
        }
        dialogTitle={"Avertissement !"}
        isOpen={onBloqued}
        onClose={() => {
          setOnBloqued(false);
        }}
        onOpen={() => {
          setOnBloqued(true);
        }}
      />
      {/* <UpdatetesmonialFormModal
      openModal={openModal}
      setOpenModal={setOpenModal}
      tesmonial={tesmonial}
      handleFindtesmonials={handleFindtesmonials}
    /> */}
    </div>
  );
};
