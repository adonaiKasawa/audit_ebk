import { Session } from "next-auth";
import React, { Dispatch, SetStateAction, useState } from "react";
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

import { contentColumns } from "./data";

import {
  deleteContentBibleStudyApi,
  findBibleStudyById,
} from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";
import { ItemContentBibleStudy } from "@/app/lib/config/interface";
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { file_url } from "@/app/lib/request/request";
import { capitalize } from "@/app/lib/config/func";
import BibleStudyAddContentFormModal from "@/ui/modal/form/bibleStudy/add.content";

const INITIAL_VISIBLE_COLUMNS = ["formation", "titre", "actions"];

export default function BibleStudyContentSsrTableUI({
  params,
  initData,
  session,
}: {
  params: { id: string };
  session: Session;
  initData: ItemContentBibleStudy[];
}) {
  const [bibleStudys, setBiblestudys] =
    useState<ItemContentBibleStudy[]>(initData);

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

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle] = useState<string>("");

  const [page, setPage] = React.useState(1);

  const pages = bibleStudys ? Math.ceil(bibleStudys.length / rowsPerPage) : 0;

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return contentColumns;

    return contentColumns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredBibleStudy = [...bibleStudys];

    if (hasSearchFilter) {
      filteredBibleStudy = filteredBibleStudy.filter((biblestudy) =>
        biblestudy.titre
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
        sortDescriptor.column as keyof ItemContentBibleStudy
      ] as number;
      const second = b[
        sortDescriptor.column as keyof ItemContentBibleStudy
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (contentsBibleStudy: ItemContentBibleStudy, columnKey: React.Key) => {
      switch (columnKey) {
        case "#":
          return <p>1</p>;
        case "titre":
          return <p>{contentsBibleStudy.titre}</p>;
        case "formation":
          return (
            <div>
              <Avatar
                alt={`${contentsBibleStudy.titre}`}
                className="object-center rounded-md"
                // fallback={
                //   <Image
                //     alt="BibleStudyImage"
                //     height={100}
                //     src={`/ecclessia.png`}
                //     width={200}
                //   />
                // }
                src={`${file_url}${contentsBibleStudy.image}`}
                style={{ width: 200, height: 100 }}
              />
            </div>
          );
        case "actions":
          return (
            <ActionBibleStudy
              BibleStudys={bibleStudys}
              contentBibleStudy={contentsBibleStudy}
              handleFindBibleStudy={handleFindBiblestudy}
              setBibleStudys={setBiblestudys}
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

  const handleFindBiblestudy = async () => {
    if (session) {
      const find = await findBibleStudyById(parseInt(params.id));

      if (
        !find.hasOwnProperty("statusCode") &&
        !find.hasOwnProperty("message")
      ) {
        setBiblestudys(find.contentsBibleStudy);
      } else {
        setOpenAlert(true);
        setAlertMsg(
          "Oups ! Une erreur est survenue lors de la synchronisation. La page va être rechargée automatiquement.",
        );
        document.location = `church/bible-study/${params.id}`;
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
                  Colonne
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
                {contentColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <BibleStudyAddContentFormModal
              handleFindBiblestudy={handleFindBiblestudy}
              id_bibleStudy={parseInt(params.id)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {bibleStudys.length} etude biblique
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

  return (
    <div>
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
          {(item: ItemContentBibleStudy) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    </div>
  );
}

export const ActionBibleStudy = ({
  contentBibleStudy,
  handleFindBibleStudy,
}: {
  contentBibleStudy: ItemContentBibleStudy;
  setBibleStudys: Dispatch<SetStateAction<ItemContentBibleStudy[]>>;
  BibleStudys: ItemContentBibleStudy[];
  handleFindBibleStudy: () => Promise<void>;
}) => {
  const [, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleDeleteBibleStudy = async () => {
    const deleteContent = await deleteContentBibleStudyApi(
      contentBibleStudy.id,
    );

    if (
      deleteContent.hasOwnProperty("statusCode") &&
      deleteContent.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof deleteContent.message === "object") {
        let message = "";

        deleteContent.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(deleteContent.message);
      }
    } else {
      await handleFindBibleStudy();
      setOpenModal(false);
      setOpenAlert(true);
      setAlertTitle("Réussi");
      setAlertMsg("La suppresion du cours a réussi.");
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
        dialogBody={<p>Étes-vous sure de vouloir supprimer cette formation?</p>}
        dialogTitle={"Suppression de la formation"}
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
