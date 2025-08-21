import moment from "moment";

const teams = [
  {
    id: 0,
    name: "Bulldogok",
  },
  {
    id: 1,
    name: "Bp. Exiles",
  },
  { id: 2, name: "Vitézek" },
  {
    id: 3,
    name: "FW Gorillák",
  },
  {
    id: 4,
    name: "Honfoglalók",
  },
  { id: 5, name: "KARC" },
  { id: 6, name: "DEAC" },
  {
    id: 7,
    name: "Exiles-Kosok",
  },
  { id: 8, name: "FRC" },
  {
    id: 9,
    name: "Oroszlánok",
  },
  { id: 10, name: "Sasok" },
  {
    id: 11,
    name: "SzeKerCe",
  },
];

const mainColors = {
  indigo: "bg-indigo-800",
  orange: "bg-orange-800",
  zinc: "bg-zinc-800",
  emerald: "bg-emerald-800",
};

const types = [
  { name: "NB I" },
  { name: "NB II" },
  { name: "7s" },
  { name: "UP torna" },
];

const genderOptions = [{ name: "Férfi" }, { name: "Női" }];

const ages = [{ name: "Felnőtt" }, { name: "Utánpótlás" }];

const venues = [
  { id: 0, name: "Budapest" },
  { id: 1, name: "Gyömrő" },
  { id: 2, name: "Százhalombatta" },
  { id: 3, name: "Esztergom" },
  { id: 4, name: "Kecskemét" },
  { id: 5, name: "Nagykőrös" },
  { id: 6, name: "Szentes" },
  { id: 7, name: "Szeged" },
  { id: 8, name: "Székesfehérvár" },
  { id: 9, name: "Debrecen" },
  { id: 10, name: "Sopron" },
];

const hours = Array.from(
  {
    length: 48,
  },
  (_, hour) =>
    moment({
      hour: Math.floor(hour / 2),
      minutes: hour % 2 === 0 ? 0 : 30,
    }).format("HH:mm")
);

const weekDays = ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"];
const months = [
  "Jan",
  "Feb",
  "Már",
  "Ápr",
  "Máj",
  "Jún",
  "Júl",
  "Aug",
  "Szep",
  "Okt",
  "Nov",
  "Dec",
];

export {
  teams,
  mainColors,
  types,
  genderOptions,
  ages,
  venues,
  hours,
  weekDays,
  months,
};
