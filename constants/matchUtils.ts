import moment from "moment";

const mainColors = {
  indigo: "bg-indigo-800",
  orange: "bg-orange-800",
  zinc: "bg-zinc-800",
  emerald: "bg-emerald-800",
};

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

export {
  mainColors,
  hours,
};
