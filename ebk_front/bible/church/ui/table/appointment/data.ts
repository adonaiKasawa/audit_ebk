const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Fidele", uid: "fidele", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Motif", uid: "motif", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "En attente", uid: "awaiting" },
  { name: "Approuver", uid: "approuved" },
  { name: "Réporter", uid: "postpone" },
  { name: "Annuler", uid: "cancel" },
];

export { columns, statusOptions };
