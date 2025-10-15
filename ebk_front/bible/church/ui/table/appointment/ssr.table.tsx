import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import { Button } from "@heroui/button";
import { ChipProps, Chip } from "@heroui/chip";
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
import { User } from "@heroui/user";
import { Selection, SortDescriptor } from "@react-types/shared";

import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "../../icons";
import Alert from "../../modal/alert";
import DialogAction from "../../modal/dialog";
import {
  AddDayForAppointment,
  ListOfDayForAppointment,
  ReporterAppointmentFormModal,
} from "../../modal/form/appointment";

import { columns, statusOptions } from "./data";

import { capitalize } from "@/app/lib/config/func";
import {
  cancelAppointmentApi,
  confirmAppointmentApi,
  findAppointmentApi,
  findDayApi,
} from "@/app/lib/actions/appointment/appoint.req";

const statusColorMap: Record<string, ChipProps["color"]> = {
  awaiting: "primary",
  approuved: "success",
  postpone: "warning",
  cancel: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "fidele",
  "date",
  "motif",
  "status",
  "actions",
];

export default function SsrTableUI({
  initAppointement,
}: {
  initAppointement: any;
}) {
  const [appointments, setAppointment] = useState<any>(initAppointement);
  const [day, setDay] = useState<any[]>([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  type Appointment = (typeof appointments)[0];

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(appointments.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAppointments = [...appointments];

    if (hasSearchFilter) {
      filteredAppointments = filteredAppointments.filter(
        (appointment) =>
          appointment.requestDate
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment.user.nom
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment.user.prenom
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment.user.telephone
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          `${appointment.user.nom} ${appointment.user.prenom}`
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          `${appointment.user.prenom} ${appointment.user.nom}`
            .toLowerCase()
            .includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredAppointments = filteredAppointments.filter((appointment) =>
        Array.from(statusFilter).includes(appointment.confirm),
      );
    }

    return filteredAppointments;
  }, [appointments, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof Appointment] as number;
      const second = b[sortDescriptor.column as keyof Appointment] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (appointment: Appointment, columnKey: React.Key) => {
      switch (columnKey) {
        case "fidele":
          return (
            <User
              avatarProps={{ radius: "full", size: "sm", src: "" }}
              classNames={{
                description: "text-default-500",
              }}
              description={appointment.user.telephone}
              name={`${appointment.user.nom} ${appointment.user.prenom}`}
            >
              {appointment.user.nom} {appointment.user.prenom}
            </User>
          );
        case "date":
          return <p>{moment(appointment.requestDate).calendar()} </p>;
        case "motif":
          return <p>{appointment.motif} </p>;
        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[appointment.confirm]}
              size="sm"
              variant="dot"
            >
              {capitalize(
                statusOptions.find((item) => item.uid === appointment.confirm)
                  ?.name,
              )}
            </Chip>
          );
        case "actions":
          return (
            <ActionAppointment
              appointment={appointment}
              appointments={appointments}
              handleFindAppointment={handleFindAppointment}
              setAppointments={setAppointment}
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

  const handleFindAppointment = async () => {
    const find = await findAppointmentApi();

    if (find) {
      setAppointment(find);
    }
  };

  const handleFindDay = async () => {
    const find = await findDayApi();

    if (find) {
      setDay(find);
    }
  };

  useEffect(() => {
    handleFindAppointment();
    handleFindDay();
  }, []);

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
                  <DropdownItem key={status.uid} className="capitalize">
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
            <AddDayForAppointment handleFindDay={handleFindDay} />
            <ListOfDayForAppointment day={day} setDay={setDay} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {appointments.length} rendez-vous
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
        {(item: Appointment) => (
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

export const ActionAppointment = ({
  appointment,
  handleFindAppointment,
}: {
  appointment: any;
  setAppointments: Dispatch<SetStateAction<any>>;
  appointments: any[];
  handleFindAppointment: any;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ondelete, setOnDelete] = useState<boolean>(false);
  const [onConfirme, setOnConfirme] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleDeleteAppointment = async () => {
    const req = await cancelAppointmentApi(appointment.id);

    if (req.hasOwnProperty("statusCode") && req.hasOwnProperty("error")) {
      setOpenAlert(true);
      setAlertMsg(req.message);
      setAlertTitle("Erreur");
    } else {
      handleFindAppointment();
    }
  };

  const handleConfirmeAppointment = async () => {
    const req = await confirmAppointmentApi(appointment.id);

    if (req.hasOwnProperty("statusCode") && req.hasOwnProperty("error")) {
      setOpenAlert(true);
      setAlertMsg(req.message);
      setAlertTitle("Erreur");
    } else {
      handleFindAppointment();
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
            key={"report"}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Réporter
          </DropdownItem>
          <DropdownItem
            key={"confirm"}
            onClick={() => {
              setOnConfirme(true);
            }}
          >
            Confirmer
          </DropdownItem>
          <DropdownItem
            key={"cancel"}
            onClick={() => {
              setOnDelete(true);
            }}
          >
            Annuler
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
      <ReporterAppointmentFormModal
        appointment={appointment}
        handleFindAppointment={handleFindAppointment}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <DialogAction
        action={handleDeleteAppointment}
        dialogBody={<p>Étes-vous sure de vouloir annuler ce rendez-vous?</p>}
        dialogTitle={"Annulation de rendez-vous"}
        isOpen={ondelete}
        onClose={() => {
          setOnDelete(false);
        }}
        onOpen={() => {
          setOnDelete(true);
        }}
      />
      <DialogAction
        action={handleConfirmeAppointment}
        dialogBody={<p>Étes-vous sure de vouloir confirmer ce rendez-vous?</p>}
        dialogTitle={"Confirmation du rendez-vous"}
        isOpen={onConfirme}
        onClose={() => {
          setOnConfirme(false);
        }}
        onOpen={() => {
          setOnConfirme(true);
        }}
      />
    </div>
  );
};
