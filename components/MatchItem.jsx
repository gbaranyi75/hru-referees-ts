"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  MdOutlineExpandMore,
  MdOutlineExpandLess,
  MdAccessTime,
} from "react-icons/md";

const mainColors = {
  indigo: "bg-indigo-800",
  orange: "bg-orange-800",
  zinc: "bg-zinc-800",
  emerald: "bg-emerald-800",
};

const MatchItem = ({ match, isOpen, toggle, isAdmin, setToEdit }) => {
  const pathName = usePathname();
  const router = useRouter();

  const isSingleMatch = match.type === "NB I" || match.type === "NB II";

  let titleClass = "flex mx-auto px-5 text-white justify-center ";
  if (match.type === "NB I") {
    titleClass += mainColors.indigo;
  }
  if (match.type === "NB II") {
    titleClass += mainColors.orange;
  }
  if (match.type === "7s") {
    titleClass += mainColors.emerald;
  }
  if (match.type === "UP torna") {
    titleClass += mainColors.zinc;
  }

  const handleOpenMatchDetail = (e) => {
    e.preventDefault();
    toggle();
  };

  const handleEditMode = (e) => {
    e.preventDefault();
    console.log(match._id);
    const id = match._id
    router.push(`/dashboard/matches/edit/${id}`);
    setToEdit();
  };

  return (
    <div className="flex flex-col drop-shadow-md my-5 mx-4 pb-2 bg-white text-gray-600 text-center justify-center z-0">
      {isAdmin && pathName === "/dashboard/matches/edit" && (
        <button onClick={handleEditMode}>edit</button>
      )}

      <div className={titleClass}>
        <h3 className="pr-1">{match.age}</h3>
        <h3 className="px-1">{match.gender}</h3>
        <h3 className="pl-1">{match.type}</h3>
      </div>
      <div className="flex pt-2 justify-around">
        <div className="my-auto w-[90px] md:w-[120px] text-md md:text-lg font-semibold">
          {match.home}
        </div>
        <div className="flex flex-col px-4">
          <div className="flex">
            <div className="my-auto mr-1">
              <MdAccessTime size={20} />
            </div>
            <div className="text-lg ml-1">{match.time}</div>
          </div>
          <div className="text-sm text-center">{match.date}</div>
        </div>
        <div className="my-auto w-[90px] md:w-[120px] text-md md:text-lg font-semibold">
          {match.away}
        </div>
      </div>
      <div className="flex justify-center text-sky-600 text-sm">
        {match.venue}
      </div>
      <div
        className="flex justify-center my-auto cursor-pointer"
        onClick={handleOpenMatchDetail}
      >
        {!isOpen ? (
          <MdOutlineExpandMore size={24} />
        ) : (
          <MdOutlineExpandLess size={24} />
        )}
      </div>
      {isOpen && isSingleMatch && (
        <div className="flex flex-col pt-2 justify-center text-center">
          <div className="flex flex-col text-sm">
            <p className="font-bold">Játékvezető:</p>
            <p>{match.referee.userName}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center mx-auto md:mx-0">
            <div className="flex text-sm text-center justify-center">
              <p className="font-semibold">Asszisztens 1:</p>
              <p className="pl-1 md:px-1">{match.assist1.userName}</p>
            </div>
            <div className="flex text-sm text-center justify-center">
              <p className="font-semibold md:pl-1">Asszisztens 2:</p>
              <p className="pl-1">{match.assist2.userName}</p>
            </div>
          </div>
          <div className="flex flex-col pt-2 justify-center text-center">
            <div className="flex flex-col text-sm">
              <p className="font-bold">Ellenőr(ök):</p>
            </div>
            {match.controllers.map((ref) => (
              <p className="text-sm">{ref.userName}</p>
            ))}
          </div>
        </div>
      )}
      {isOpen && !isSingleMatch && (
        <div className="flex flex-col pt-2 justify-center text-center">
          <div className="flex flex-col text-sm">
            <p className="font-bold">Játékvezetők:</p>
          </div>
          {match.referees.map((ref) => (
            <p className="text-sm">{ref.userName}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchItem;
