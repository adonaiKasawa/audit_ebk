import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import moment from "moment";
import { Selection, SortDescriptor } from "@react-types/shared";
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

import { columns, statusOptions } from "./data";
import { ActionExpense } from "./action.ssr.table";

import { capitalize } from "@/app/lib/config/func";
import { ManagementExpenses } from "@/app/lib/config/interface";
import { SearchIcon, ChevronDownIcon } from "@/ui/icons";
import { findManagementExpensesByEgliseIdApi } from "@/app/lib/actions/management/finance/finance.req";
import CreateExpenseFormModal from "@/ui/modal/form/finance/expense";

const INITIAL_VISIBLE_COLUMNS = [
  "date",
  "motif",
  "amount",
  "budget",
  "actions",
];

export default function FinanceExpenseSsrTableUI({
  initData,
  session,
}: {
  session: Session;
  initData: ManagementExpenses[];
}) {
  const [events, setEvents] = useState<ManagementExpenses[]>(initData);
  const [day, setDay] = useState<any[]>([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys] = React.useState<Selection>(new Set([1, 2]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  type Expense = ManagementExpenses;

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(events.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredEvents = [...events];

    if (hasSearchFilter) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.motif.toLowerCase().includes(filterValue.toLowerCase()) ||
          event.budget?.budgetLine
            .toLowerCase()
            .includes(filterValue.toLowerCase()),
      );
    }

    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredEvents = filteredEvents.filter((event) =>
    //     Array.from(statusFilter).includes(event.isBlocked ? "inactif" : "actif"),
    //   );
    // }

    return filteredEvents;
  }, [events, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof Expense] as number;
      const second = b[sortDescriptor.column as keyof Expense] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (expense: Expense, columnKey: React.Key) => {
      switch (columnKey) {
        case "date":
          return <p>{moment(expense.createdAt).format("DD-MM-YYYY")} </p>;
        case "amount":
          return <p>{expense.amount} USD</p>;
        case "motif":
          if (expense.budget) {
            return <p>{expense.budget.description}</p>;
          } else {
            return <p>{expense.motif}</p>;
          }
        case "budget":
          if (expense.budget) {
            return <p>{expense.budget.budgetLine}</p>;
          } else {
            return <p>Depense non budgetisé</p>;
          }
        case "actions":
          return (
            <ActionExpense
              expense={expense}
              handleFindExpense={handleFindExpense}
              session={session}
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

  const handleFindExpense = async () => {
    if (session) {
      const find = await findManagementExpensesByEgliseIdApi(
        session.user.eglise.id_eglise,
      );

      if (find) {
        setEvents(find);
      }
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 justify-between gap-3 mt-4">
          <Input
            fullWidth
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              // inputWrapper: "border-1",
            }}
            placeholder="Rechercher par date..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex justify-end gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="none"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.name} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
            <CreateExpenseFormModal
              handleFindExpense={handleFindExpense}
              session={session}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {events.length} événement
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

  useEffect(() => {
    // events.map((item: ManagementEvent) => {
    //   if (item.isCancel !== null) {
    //     console.log("isCancel", new Set([item.id]));
    //     setSelectedKeys(new Set([`${item.id}`]))
    //   }
    // })
  }, [events]);

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
      color={"danger"}
      defaultSelectedKeys={selectedKeys}
      isCompact={false}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
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
      <TableBody emptyContent={"Aucune depense trouvé"} items={sortedItems}>
        {(item: Expense) => (
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
