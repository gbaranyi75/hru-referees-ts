"use client";
import { useState, useEffect } from "react";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { toast } from "react-toastify";
import OutlinedButton from "@/components/common/OutlinedButton";
import DisabledButton from "@/components/common/DisabledButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import Spinner from "@/components/common/Spinner";
import { createNewUserSelection } from "@/lib/actions/createUserSelection";
import { fetchUserSelection } from "@/lib/actions/fetchUserSelection";
import { updateUserSelection } from "@/lib/actions/updateUserSelection";
import { Calendar, User } from "@/types/types";
import MatchDayCalendar from "./MatchDayCalendar";

const AddMatchDaysItem = ({
  calendar,
  isOpen,
  toggle,
  profile,
}: {
  calendar: Calendar;
  isOpen: boolean;
  toggle: () => void;
  profile: User;
}) => {
  const eventName = calendar?.name;

  const [edited, setEdited] = useState(false);
  const [isSelection, setIsSelection] = useState(false);
  const [selectionId, setSelectionId] = useState("");
  const [myCurrentDates, setMyCurrentDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState<string[]>(myCurrentDates);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenCalendar = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    toggle();
  };

  const clearAndCloseCard = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEdited(false);
    setSelectedDates(myCurrentDates);
    toggle();
  };

  const handleDateSelect = (date: string) => {
    let selectedDatesArray: string[] = [...selectedDates];

    if (!selectedDatesArray.includes(date)) {
      selectedDatesArray = [...selectedDates, date];
    } else {
      selectedDatesArray.splice(selectedDates.indexOf(date), 1);
    }
    myCurrentDates.toString() === selectedDatesArray.toString()
      ? setEdited(false)
      : setEdited(true);
    setSelectedDates(selectedDatesArray);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (selectionId) {
      const res = await updateUserSelection(selectionId, selectedDates);
      const success = res instanceof Error ? false : res.success;
      if (success) setIsSuccess(true);
      toast.success("Sikeres mentés");
    } else {
      const res = await createNewUserSelection({
        calendarName: calendar.name,
        calendarId: calendar._id,
        selectedDays: selectedDates,
        username: profile.username,
        clerkUserId: profile.clerkUserId,
      });
      const success = res instanceof Error ? false : res.success;
      if (success) setSelectedDates(selectedDates);
      toast.success("Sikeres mentés");
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchCurrentSelection = async () => {
      const selection = await fetchUserSelection(calendar._id);
      if (selection?._id) {
        setIsSelection(true);
        setMyCurrentDates(selection.selectedDays);
        setSelectedDates(selection.selectedDays);
        setSelectionId(selection._id);
      }
    };
    fetchCurrentSelection();
    setLoading(false);
  }, [calendar]);

  const daysBadges = (day: string) => {
    return (
      <div className="flex">
        <span
          id={!selectedDates?.includes(day) ? "badge-dark" : "badge-green"}
          className={
            !selectedDates?.includes(day)
              ? "inline-flex items-center px-4 py-2 font-semibold text-sm text-red-200 bg-red-600 rounded-full"
              : "inline-flex items-center px-4 py-2 font-semibold text-sm bg-green-900 text-green-300 rounded-full"
          }
        >
          {day}
          <button
            type="button"
            className={
              !selectedDates?.includes(day)
                ? "inline-flex items-center p-2 text-sm text-red-200 bg-transparent rounded-sm hover:bg-red-400 hover:text-gray-50"
                : "inline-flex items-center p-2 text-sm text-green-400 bg-transparent rounded-sm hover:bg-green-600 hover:text-green-100"
            }
            data-dismiss-target="#badge-dismiss-dark"
            aria-label="Remove"
            onClick={() => {
              handleDateSelect(day);
            }}
          >
            {!selectedDates?.includes(day) ? (
              <>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
                <span className="sr-only">Not selected</span>
              </>
            ) : (
              <>
                <svg
                  className="w-2.5 h-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>

                <span className="sr-only">Selected</span>
              </>
            )}
          </button>
        </span>
      </div>
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col border overflow-hidden rounded-xl border-gray-200 bg-white text-gray-600 text-center justify-center z-0">
      <div
        className={`flex md:px-6 py-6 items-center justify-between ${isOpen ? "bg-gray-100" : "bg-white"}`}
      >
        <span className="ml-6">
          <h2 className="text-lg font-semibold">{eventName}</h2>
        </span>
        <span
          className="my-auto mr-6 p-2 rounded-full bg-gray-200 cursor-pointer"
          onClick={handleOpenCalendar}
        >
          {!isOpen ? (
            <MdOutlineExpandMore size={24} />
          ) : (
            <MdOutlineExpandLess size={24} />
          )}
        </span>
      </div>
      {isOpen && (
        <>
          <div className="overflow-hidden">
            <div className="overflow-x-auto z-1">
              <div className="min-w-[600px]">
                <MatchDayCalendar
                  calendar={calendar}
                  handleDateSelect={handleDateSelect}
                  selectedDates={selectedDates}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse justify-around m-5">
            <div className="px-4 py-3 text-center sm:px-6">
              {edited ? (
                <PrimaryButton
                  type={"submit"}
                  text={"Mentés"}
                  onClick={handleSubmit}
                />
              ) : (
                <DisabledButton text={"Mentés"} />
              )}
            </div>
            <div className="px-4 py-3 text-center sm:px-6">
              <OutlinedButton
                text={"Vissza"}
                type={"button"}
                onClick={clearAndCloseCard}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default AddMatchDaysItem;
