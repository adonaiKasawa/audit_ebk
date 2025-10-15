"use client";

import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Session } from "next-auth";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input, Textarea } from "@heroui/input";
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
import Link from "next/link";

import { columns } from "./data";

import {
  BiblePlanLecturePaginated,
  ItemBiblePlanLecture,
} from "@/app/lib/config/interface";
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { file_url } from "@/app/lib/request/request";
import { capitalize } from "@/app/lib/config/func";
import AddBiblePlanLectureFormModal from "@/ui/modal/form/plan_lecture";
import {
  deletePlanLecture,
  getAllPlanLecturesPagination,
  updatePlanLecture,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";
import UpdateBiblePlanLectureFormModal from "@/ui/modal/form/plan_lecture/update";

const INITIAL_VISIBLE_COLUMNS = [
  "picture",
  "title",
  "number_days",
  "description",
  "actions",
];

export default function BiblePlanLectureSsrTableUI({
  initData,
  session,
}: {
  session: Session;
  initData: BiblePlanLecturePaginated;
}) {
  const [bibleStudys, setBiblestudys] = useState<ItemBiblePlanLecture[]>(
    initData.items,
  );

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

  const [openDialog, setOpendDialog] = React.useState(false);
  const [isEditingType, setIsEditingType] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [cellClikedId, setCellClikedId] = useState<number>(0);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const [selectPlanForUpdate, setSelectPlanForUpdate] = useState<any>(null);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  const [page, setPage] = React.useState(1);

  const pages = bibleStudys ? Math.ceil(bibleStudys.length / rowsPerPage) : 0;

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredBibleStudy = [...bibleStudys];

    if (hasSearchFilter) {
      filteredBibleStudy = filteredBibleStudy.filter((biblestudy) =>
        biblestudy.title
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      );
    }

    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredBibleStudy = filteredBibleStudy.filter((membre) =>
    //     Array.from(statusFilter).includes(membre.status),
    //   );
    // }

    return filteredBibleStudy;
  }, [bibleStudys, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[
        sortDescriptor.column as keyof ItemBiblePlanLecture
      ] as number;
      const second = b[
        sortDescriptor.column as keyof ItemBiblePlanLecture
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (BiblePlanLecture: ItemBiblePlanLecture, columnKey: React.Key) => {
      switch (columnKey) {
        case "title":
          return <p>{BiblePlanLecture.title}</p>;
        case "number_days":
          return <p>{BiblePlanLecture.number_days}</p>;
        case "description":
          return (
            <p>
              {BiblePlanLecture.description.slice(0, 100)}
              {BiblePlanLecture.description.length > 100 && "..."}
            </p>
          );
        case "picture":
          return (
            <Link
              className="cursor-pointer"
              href={`/church/plan-lecture/${BiblePlanLecture.id}`}
            >
              <Avatar
                alt={`${BiblePlanLecture.title}`}
                className="object-center rounded-md"
                // fallback={
                //   // <Image
                //   //   alt="BibleStudyImage"
                //   //   height={100}
                //   //   src={`/ecclessia.png`}
                //   //   width={200}
                //   // />
                // }
                src={`${file_url}${
                  BiblePlanLecture?.picture &&
                  BiblePlanLecture.picture.trim() != ""
                    ? BiblePlanLecture.picture
                    : "/ecclessia.png"
                }`}
                style={{ width: 200, height: 100 }}
              />
            </Link>
          );
        case "actions":
          return (
            <ActionBiblePlanLecture
              BibleStudy={BiblePlanLecture}
              BibleStudys={bibleStudys}
              handleFindBibleStudy={handleFindBiblestudy}
              setBibleStudys={setBiblestudys}
              setOpenModalUpdate={setOpenModalUpdate}
              setPlanSelected={setSelectPlanForUpdate}
            />
          );
        default:
          return <></>;
      }
    },
    [],
  );

  const handleClickCell = (
    bibleStudy: ItemBiblePlanLecture,
    columnKey: React.Key,
  ) => {
    if (
      columnKey === "title" ||
      columnKey === "description" ||
      columnKey === "number_days"
    ) {
      setOpendDialog(true);
      setIsEditingType(columnKey);
      setCellClikedId(bibleStudy.id);
      setValue(bibleStudy[columnKey].toString());
    }
  };

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

  const handleFindBiblestudy = async () => {
    if (session) {
      const find = await getAllPlanLecturesPagination();

      if (find) {
        setBiblestudys(find.items);
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
            placeholder="Rechercher par titre..."
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
            <AddBiblePlanLectureFormModal />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {bibleStudys.length} plan de lecture
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

  const handleUpdateBibleStudy = async () => {
    if (value !== "") {
      const dto =
        isEditingType === "title"
          ? { title: value }
          : isEditingType === "number_days"
            ? { number_days: parseInt(value) }
            : { description: value };

      const update = await updatePlanLecture(cellClikedId, dto);

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
        await handleFindBiblestudy();
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      setAlertMsg(
        `${
          isEditingType === "titre" ? "le" : "la"
        } ${isEditingType} ne doit pas être vide!`,
      );
    }
  };

  const renderUpdateTitleOrDescription = () => {
    return (
      <div>
        <div className="w-full flex flex-col gap-4">
          <p>
            Modifier {isEditingType === "title" ? "le" : "la"} {isEditingType}
          </p>
          {(isEditingType === "title" || isEditingType === "number_days") && (
            <Input
              label={capitalize(isEditingType)}
              placeholder={isEditingType}
              type={isEditingType === "number_days" ? "number" : "text"}
              value={value}
              variant="bordered"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          )}
          {isEditingType === "description" && (
            <Textarea
              required
              className="col-span-12 md:col-span-6 mb-6 md:mb-0"
              defaultValue={value}
              labelPlacement="outside"
              placeholder="Entrer la devotion du jour"
              value={value}
              variant="bordered"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
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
        <TableBody
          emptyContent={"Aucune formations trouvé"}
          items={sortedItems}
        >
          {(item: ItemBiblePlanLecture) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell
                  onClick={() => {
                    handleClickCell(item, columnKey);
                  }}
                >
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {openModalUpdate && (
        <UpdateBiblePlanLectureFormModal
          findPlan={handleFindBiblestudy}
          openModal={openModalUpdate}
          plan={selectPlanForUpdate}
          setOpenModal={setOpenModalUpdate}
        />
      )}

      <DialogAction
        action={handleUpdateBibleStudy}
        dialogBody={renderUpdateTitleOrDescription()}
        dialogTitle={"Modification de la formation"}
        isOpen={openDialog}
        onClose={() => {
          setOpendDialog(false);
        }}
        onOpen={() => {
          setOpendDialog(true);
        }}
      />
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
    </>
  );
}

export const ActionBiblePlanLecture = ({
  BibleStudy,
  handleFindBibleStudy,
  setOpenModalUpdate,
  setPlanSelected,
}: {
  BibleStudy: ItemBiblePlanLecture;
  setBibleStudys: Dispatch<SetStateAction<ItemBiblePlanLecture[]>>;
  BibleStudys: ItemBiblePlanLecture[];
  handleFindBibleStudy: () => void;
  setOpenModalUpdate: Function;
  setPlanSelected: Function;
}) => {
  const [, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  // const [openModify, setOpenModify] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  // const handleUpdateBiblePlanLectureContent = async () => {
  //   const update = await deletePlanLecture(BibleStudy.id);

  //   if (
  //     update.hasOwnProperty("statusCode") &&
  //     update.hasOwnProperty("message")
  //   ) {
  //     setOpenAlert(true);
  //     setAlertTitle("Erreur");
  //     if (typeof update.message === "object") {
  //       let message = "";

  //       update.message.map((item: string) => (message += `${item} \n`));
  //       setAlertMsg(message);
  //     } else {
  //       setAlertMsg(update.message);
  //     }
  //   } else {
  //     handleFindBibleStudy();
  //     setOpenModal(false);
  //     setOpenAlert(true);
  //     setAlertTitle("Réussi");
  //     setAlertMsg("La suppresion de la formation a réussi.");
  //   }
  // };

  const handleDeleteBibleStudy = async () => {
    const update = await deletePlanLecture(BibleStudy.id);

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
      handleFindBibleStudy();
      setOpenModal(false);
      setOpenAlert(true);
      setAlertTitle("Réussi");
      setAlertMsg("La suppresion de la formation a réussi.");
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
            key={"delete"}
            onClick={() => {
              setOnBloqued(true);
            }}
          >
            Supprimer
          </DropdownItem>
          <DropdownItem
            key={"update"}
            onClick={() => {
              setOpenModalUpdate(true);
              setPlanSelected(BibleStudy);
            }}
          >
            Modifier
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
        action={handleDeleteBibleStudy}
        dialogBody={
          <p>Étes-vous sure de vouloir supprimer ce plan de lecture?</p>
        }
        dialogTitle={"Suppression du plan de lecture"}
        isOpen={onBloqued}
        onClose={() => {
          setOnBloqued(false);
        }}
        onOpen={() => {
          setOnBloqued(true);
        }}
      />
    </div>
  );
};
