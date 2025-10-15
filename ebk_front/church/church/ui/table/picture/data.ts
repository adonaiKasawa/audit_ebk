const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "date", uid: "date", sortable: true },
  { name: "Fichier", uid: "lien", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "Like", uid: "like", sortable: true },
  { name: "Commentaire", uid: "comment", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: "actif" },
  { name: "Inactif", uid: "inactif" },
];

export { columns, statusOptions };
