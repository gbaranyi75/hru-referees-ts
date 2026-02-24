"use client";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { hu } from "react-day-picker/locale";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import DisabledButton from "@/components/common/DisabledButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import DeleteButton from "../common/DeleteButton";
import Input from "@/components/common/InputField";
import Label from "@/components/common/Label";
import { useUpdateCalendar, useDeleteCalendar } from "@/hooks/useCalendars";
import { Calendar } from "@/types/types";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

const CalendarItem = ({
  calendar,
  isOpen,
  toggle,
  toggleEditMode,
}: {
  calendar: Calendar;
  isOpen: boolean;
  toggle: () => void;
  toggleEditMode: () => void;
}) => {
  const [dates, setDates] = useState<string[]>(calendar.days);
  const [eventName, setEventName] = useState(calendar.name as string);
  const [edited, setEdited] = useState(false);
  const [showErrorDate, setShowErrorDate] = useState(false);
  const [showErrorName, setShowErrorName] = useState(false);
  const [selected, setSelected] = useState<Date[] | undefined>([]);
  const calendarId = calendar._id;

  // React Query mutations
  const updateMutation = useUpdateCalendar();
  const deleteMutation = useDeleteCalendar();

  const defaultClassNames = getDefaultClassNames();

  const handleOpenCalendar = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    toggle();
  };

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setEdited(true);
    }
    setEventName(e.target.value);
  };

  const transformDateFormat = useCallback((date: Date) => {
    return date.toLocaleDateString("hu-HU", DATE_FORMAT_OPTIONS);
  }, []);

  useEffect(() => {
    setShowErrorDate(false);
  }, [dates]);

  /* Handlers using React Query mutations */
  const handleUpdate = async () => {
    if (dates.length !== 0 && eventName !== "") {
      const updatedCalendar = { name: eventName, days: dates };
      try {
        await updateMutation.mutateAsync({
          calendarId,
          data: updatedCalendar,
        });
        resetToBase();
        toggleEditMode();
        toast.success("Sikeres mentés");
      } catch (error) {
        console.error("Error updating calendar:", error);
        toast.error("Hiba történt a mentés során");
      }
    } else {
      setShowErrorDate(dates.length === 0);
      setShowErrorName(eventName === "");
    }
  };

  const handleDeleteCalendar = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    try {
      await deleteMutation.mutateAsync(calendarId);
      toggleEditMode();
      toast.success("Sikeres törlés");
    } catch (error) {
      console.error("Error deleting calendar:", error);
      toast.error("Hiba történt a törlés során");
    }
  };

  /* Initializing current data from DB  */
  useEffect(() => {
    const currentDays: Date[] = [];
    calendar.days.map((day) => currentDays.push(new Date(day)));

    setSelected(currentDays);
  }, [calendar.days]);

  useEffect(() => {
    const days: string[] = [];
    if (selected?.length !== 0) setEdited(true);
    selected?.forEach((date) => {
      days.push(transformDateFormat(date).toString());
      days.sort();
    });
    setDates(days);
  }, [selected, transformDateFormat]);

  /* Util functions */
  const resetToBase = () => {
    setDates([]);
    setEventName("");
    setSelected([]);
    setEdited(false);
    setShowErrorName(false);
    setShowErrorDate(false);
  };

  return (
    <div className="flex flex-col border mt-4 overflow-hidden rounded-xl border-gray-200 bg-white text-gray-600 text-center justify-center z-0">
      <div
        className={`flex md:px-6 py-6 items-center justify-between ${isOpen ? "bg-gray-100" : "bg-white"}`}
      >
        <span className="ml-6">
          <h2 className="text-lg mr-1 font-semibold">{eventName}</h2>
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
        <form className="flex flex-col px-4">
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-x-10 gap-y-5 xl:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="eventName">Esemény neve</Label>
                <Input
                  type="text"
                  defaultValue={calendar.name}
                  onChange={handleEventNameChange}
                />

                {showErrorName && (
                  <div className="flex flex-col md:justify-center">
                    <p className="mt-2 text-sm text-center text-red-600">
                      Kérlek, add meg a nevet
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col col-span-2 lg:col-span-1 items-center justify-center overflow-y-hidden">
                <Label>Időpontok kiválasztása:</Label>

                <div className="flex justify-center mx-auto mb-6 overscroll-x-auto text-sm font-medium text-gray-700">
                  <DayPicker
                    locale={hu}
                    mode="multiple"
                    animate
                    navLayout="around"
                    timeZone="Europe/Budapest"
                    showOutsideDays={true}
                    className={"p-3"}
                    selected={selected}
                    onSelect={setSelected}
                    classNames={{
                      root: `${defaultClassNames.root} border border-gray-200 rounded-xl p-5`,
                      caption_label: `${defaultClassNames.caption_label} text-base font-medium capitalize`,
                      weekday: `${defaultClassNames.weekday} uppercase text-sm`,
                      today: "border border-amber-500",
                      selected:
                        "bg-amber-500  rounded rounded-full text-white bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-5 mt-5">
              <div className="flex flex-row flex-wrap justify-center">
                {dates.map((day, idx) => {
                  return (
                    <div className="flex my-1" key={idx}>
                      <span className="inline-flex items-center px-3 py-1 me-2 text-sm text-white bg-amber-500 rounded-full">
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
              {showErrorDate && (
                <p className="mt-2 text-sm text-center text-red-600">
                  Kérlek, add meg a dátumokat!
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse lg:flex-row lg:justify-around my-5">
              <div className="px-4 py-3 text-center sm:px-6">
                <DeleteButton
                  type={"button"}
                  onClick={handleDeleteCalendar}
                  text={"Esemény törlése"}
                />
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                <OutlinedButton
                  text={"Mégse"}
                  type={"button"}
                  onClick={toggleEditMode}
                />
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                {edited ? (
                  <PrimaryButton onClick={handleUpdate} text="Módosítás" />
                ) : (
                  <DisabledButton text={"Módosítás"} />
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CalendarItem;
