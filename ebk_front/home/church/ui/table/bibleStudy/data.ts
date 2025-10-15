const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Formation", uid: "formation", sortable: true },
  { name: "Titre", uid: "titre", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "Actions", uid: "actions" },
];

const contentColumns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Formation", uid: "formation", sortable: true },
  { name: "Titre", uid: "titre", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: "actif" },
  { name: "Inactif", uid: "inactif" },
];

export { columns, statusOptions, contentColumns };
