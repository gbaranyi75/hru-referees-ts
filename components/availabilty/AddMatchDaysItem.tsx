"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { toast } from "react-toastify";
import OutlinedButton from "@/components/common/OutlinedButton";
import DisabledButton from "@/components/common/DisabledButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import MatchDayCalendar from "./MatchDayCalendar";
import Skeleton from "../common/Skeleton";
import { saveUserSelection } from "@/lib/actions/saveUserSelection";
import { Calendar, User, UserSelection } from "@/types/models";

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
    initialSelection?.selectedDays || [],
  );
  const [selectedDates, setSelectedDates] = useState<string[]>(
    initialSelection?.selectedDays || [],
  );
  const [loading, setLoading] = useState(false);

  // Update if initialSelection changes
  useEffect(() => {
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
      const res = await saveUserSelection({
        calendarName: calendar.name,
        calendarId: calendar._id,
        selectedDays: selectedDates,
        username: profile.username,
        clerkUserId: profile.clerkUserId,
      });

      if (res.success) {
        // Ez a kulcs! Frissítjük a helyi state-et a kapott ID-val
        if (res.selectionId) {
          setSelectionId(res.selectionId);
        }
        setMyCurrentDates(selectedDates);
        setEdited(false);
        toast.success("Sikeres mentés");
      } else {
        toast.error(res.error || "Hiba történt");
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
        <Skeleton className="w-full h-120" />
      </>
    );

  return (
    <div className="flex flex-col border overflow-hidden rounded-xl border-gray-200 bg-white text-gray-600 text-center justify-center z-0">
      <div
        className={`flex md:px-6 py-6 items-center justify-between ${isOpen ? "bg-gray-100" : "bg-white"}`}>
        <span className="ml-6">
          <h2 className="text-lg font-semibold">{eventName}</h2>
        </span>
        <span
          className="my-auto mr-6 p-2 rounded-full bg-gray-200 cursor-pointer"
          onClick={handleOpenCalendar}>
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
