import { Match } from "@/types/types";
import OutlinedButton from "./common/OutlinedButton";
import { MdAccessTime } from "react-icons/md";

export const MatchListTableModal = ({
  closeModal,
  selectedMatch,
}: {
  closeModal: () => void;
  selectedMatch: Match | null;
}) => {
  const isSingleMatch =
    selectedMatch?.type === "NB I" || selectedMatch?.type === "Extra Liga";

  return (
    <div className="flex flex-col items-center">
      <div className="flex mx-auto px-4 py-1 rounded-2xl text-white justify-center bg-blue-700">
        <h3 className="pr-1 text-sm">{selectedMatch?.age}</h3>
        <h3 className="px-1 text-sm">{selectedMatch?.gender}</h3>
        <h3 className="pl-1 text-sm font-semibold">{selectedMatch?.type}</h3>
      </div>
      {isSingleMatch && (
        <div className="flex flex-row items-center space-x-24 mt-3 text-gray-500 rounded-2xl bg-gray-100 p-4">
          <h3 className="text-lg font-semibold text-red-600">
            {selectedMatch?.home}
          </h3>
          <h3 className="text-xl font-semibold px-2"> - </h3>
          <h3 className="text-lg font-semibold text-green-600">
            {selectedMatch?.away}
          </h3>
        </div>
      )}
      <div className="flex justify-center text-sky-700 text-md mt-5">
        {selectedMatch?.venue}
      </div>
      <div className="flex flex-col px-4">
        <div className="flex text-sm font-bold mt-3 mb-1 justify-center">
          Időpont:
        </div>
        <div className="flex flex-row justify-center gap-1 mb-1">
          <div className="my-auto">
            <MdAccessTime size={14} />
          </div>
          <div className="text-sm">{selectedMatch?.time}</div>
        </div>
        <div className="text-sm font-semibold text-center">
          {selectedMatch?.date}
        </div>
      </div>
      {isSingleMatch && (
        <div className="flex flex-col mt-6 justify-center text-center">
          <div className="flex flex-col text-sm">
            <p className="font-bold">Játékvezető:</p>
            <p className="text-sm">{selectedMatch?.referee?.username}</p>
          </div>
          <div className="flex flex-col mt-2 md:flex-row justify-center mx-auto md:mx-0">
            <div className="flex text-sm text-center justify-center">
              <p className="font-semibold">Asszisztens 1:</p>
              <p className="pl-1 md:px-1">
                {selectedMatch?.assist1?.username === "undefined"
                  ? ""
                  : selectedMatch?.assist1?.username}
              </p>
            </div>
            <div className="flex text-sm text-center justify-center">
              <p className="font-semibold md:pl-1">Asszisztens 2:</p>
              <p className="pl-1">
                {selectedMatch?.assist2?.username === "undefined"
                  ? ""
                  : selectedMatch?.assist2?.username}
              </p>
            </div>
          </div>
          <div className="flex flex-col pt-2 justify-center text-center">
            <div className="flex flex-col text-sm">
              <p className="font-bold">Ellenőr(ök):</p>
            </div>
            {selectedMatch?.controllers.map((ref) => (
              <p key={ref.clerkUserId} className="text-sm">
                {ref.username}
              </p>
            ))}
          </div>
        </div>
      )}
      {!isSingleMatch && (
        <div className="flex flex-col pt-5 justify-center text-center">
          <div className="flex flex-col text-sm">
            <p className="font-bold">Játékvezetők:</p>
          </div>
          {selectedMatch?.referees.map((ref) => (
            <p key={ref.clerkUserId} className="text-sm">
              {ref.username}
            </p>
          ))}
        </div>
      )}
      <div className="px-4 py-3 mt-4 text-center sm:px-6">
        <OutlinedButton onClick={closeModal} type={"button"} text={"Vissza"} />
      </div>
    </div>
  );
};
