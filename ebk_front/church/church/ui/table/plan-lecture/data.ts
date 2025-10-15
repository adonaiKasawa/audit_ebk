const columns = [
  { name: "N°", uid: "id", sortable: true },
  { name: "Image", uid: "picture", sortable: true },
  { name: "Titre", uid: "title", sortable: true },
  { name: "Jour", uid: "number_days", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "Actions", uid: "actions" },
];

const contentColumns = [
  { name: "N°", uid: "id", sortable: true },
  { name: "Image", uid: "picture", sortable: true },
  { name: "Titre", uid: "titre", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: "actif" },
  { name: "Inactif", uid: "inactif" },
];

export { columns, statusOptions, contentColumns };
