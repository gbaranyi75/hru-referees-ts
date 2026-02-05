"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { toast } from "react-toastify";
import OutlinedButton from "@/components/common/OutlinedButton";
import DisabledButton from "@/components/common/DisabledButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import { createNewUserSelection } from "@/lib/actions/createUserSelection";
import { updateUserSelection } from "@/lib/actions/updateUserSelection";
import { Calendar, User, UserSelection } from "@/types/types";
import MatchDayCalendar from "./MatchDayCalendar";
import Skeleton from "./common/Skeleton";

const AddMatchDaysItem = ({
  calendar,
  isOpen,
  toggle,
  profile,
  initialSelection,
}: {
  calendar: Calendar;
  isOpen: boolean;
  toggle: () => void;
  profile: User;
  initialSelection?: UserSelection;
}) => {
  const eventName = calendar?.name;

  const [edited, setEdited] = useState(false);
  const [selectionId, setSelectionId] = useState(initialSelection?._id || "");
  const [myCurrentDates, setMyCurrentDates] = useState<string[]>(
    initialSelection?.selectedDays || []
  );
  const [selectedDates, setSelectedDates] = useState<string[]>(
    initialSelection?.selectedDays || []
  );
  const [loading, setLoading] = useState(false);

   // Update if initialSelection changes
  useEffect(() => {
    console.log("initialSelection loaded:", initialSelection);
    if (initialSelection) {
      setSelectionId(initialSelection._id);
      setMyCurrentDates(initialSelection.selectedDays);
      setSelectedDates(initialSelection.selectedDays);
    }
  }, [initialSelection]);

  const handleOpenCalendar = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    toggle();
  };

  const clearAndCloseCard = () => {
    setEdited(false);
    setSelectedDates(myCurrentDates);
    toggle();
  };

  const handleDateSelect = (date: string) => {
    let selectedDatesArray: string[] = [...selectedDates];

    if (!selectedDatesArray.includes(date)) {
      selectedDatesArray = [...selectedDates, date];
    } else {
      // Safe removal: only splice if date is found in array
      const index = selectedDatesArray.indexOf(date);
      if (index !== -1) {
        selectedDatesArray.splice(index, 1);
      }
    }
    setEdited(myCurrentDates.toString() !== selectedDatesArray.toString());
    setSelectedDates(selectedDatesArray);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("selectionId:", selectionId, "selectedDates:", selectedDates);
      if (selectionId) {
        const res = await updateUserSelection(selectionId, selectedDates);
        const success = res instanceof Error ? false : res.success;
        if (success) {
          setMyCurrentDates(selectedDates);
          setEdited(false);
          toast.success("Sikeres mentés");
        }
      } else {
        const res = await createNewUserSelection({
          calendarName: calendar.name,
          calendarId: calendar._id,
          selectedDays: selectedDates,
          username: profile.username,
          clerkUserId: profile.clerkUserId,
        });
        const success = res instanceof Error ? false : res.success;
        if (success) {
          setMyCurrentDates(selectedDates);
          setEdited(false);
          toast.success("Sikeres mentés");
        }
      }
    } catch (error) {
      console.error("Hiba a mentéskor:", error);
      toast.error("Hiba történt a mentéskor");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-20 mb-3" />
      </>
    );

 /*  This code snippet will be used later */
/*   const daysBadges = (day: string) => {
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
  }; */

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
              <div className="min-w-150">
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
export default React.memo(AddMatchDaysItem);
