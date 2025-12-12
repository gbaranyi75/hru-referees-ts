"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { hu } from "react-day-picker/locale";
import { Icon } from "@iconify/react";
import Input from "@/components/common/InputField";
import Label from "@/components/common/Label";
import DisabledButton from "@/components/common/DisabledButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import { createNewCalendar } from "@/lib/actions/createCalendar";
import "react-day-picker/dist/style.css";

const CalendarNew = () => {
  const { session } = useSession();
  const [dates, setDates] = useState<string[]>([]);
  const [eventName, setEventName] = useState("" as string);
  const [edited, setEdited] = useState(false);
  const [selected, setSelected] = useState<Date[] | undefined>([]);
  const [createNewOpen, setCreateNewOpen] = useState(false);
  const [showErrorName, setShowErrorName] = useState(false);
  const [showErrorDate, setShowErrorDate] = useState(false);
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const defaultClassNames = getDefaultClassNames();

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setEdited(true);
    }
    setEventName(e.target.value);
  };

  const transformDateFormat = (date: Date) => {
    return date.toLocaleDateString("hu-HU", dateFormatOptions);
  };

  useEffect(() => {
    setShowErrorDate(false);
  }, [dates]);

  const toggleCreateNew = () => {
    setCreateNewOpen(!createNewOpen);
    resetToBase();
  };

  const handleSave = useCallback(async () => {
    if (dates.length !== 0 && eventName !== "") {
      const newCalendar = { name: eventName, days: dates };
      try {
        if (!session) {
          return;
        }
        const result = await createNewCalendar(newCalendar);
        if (result.success) {
          setCreateNewOpen(!createNewOpen);
          resetToBase();
          toast.success("Sikeres mentés");
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error(error);
        toast.error("Hiba történt a mentés során");
      }
    } else if (eventName === "") {
      setShowErrorName(true);
    } else if (dates.length === 0) {
      setShowErrorDate(true);
    }
  }, [eventName, dates]);

  useEffect(() => {
    const days: string[] = [];
    if (selected?.length !== 0) setEdited(true);
    selected?.forEach((date) => {
      days.push(transformDateFormat(date).toString());
      days.sort();
    });
    setDates(days);
  }, [selected]);

  const resetToBase = () => {
    setDates([]);
    setEventName("");
    setSelected([]);
    setEdited(false);
    setShowErrorName(false);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-lg font-semibold text-gray-600">
          Új táblázat létrehozása
        </h2>
        <button
          onClick={toggleCreateNew}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
        >
          <span className="">
            <Icon icon="lucide:plus" width="20" height="20" />
          </span>
          Létrehozás
        </button>
      </div>
      {createNewOpen && (
        <form className="flex flex-col">
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-x-10 gap-y-5 xl:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="eventName">Esemény neve</Label>
                <Input
                  type="text"
                  id="eventName"
                  defaultValue={""}
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
                <Label htmlFor="day-picker">Időpontok kiválasztása:</Label>

                <div className="flex justify-center mx-auto mt-1 mb-6  text-sm font-medium text-gray-700">
                  <DayPicker
                    locale={hu}
                    id="day-picker"
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
                    styles={{
                      head_cell: {
                        width: "0px",
                      },
                      table: {
                        maxWidth: "150px",
                      },
                      day: {
                        margin: "auto",
                      },
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

            <div className="flex items-center gap-3 px-2 mt-6 justify-center lg:justify-end">
              <div className="px-4 py-3 text-center sm:px-6">
                <OutlinedButton
                  text={"Mégse"}
                  type={"button"}
                  onClick={toggleCreateNew}
                />
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                {edited ? (
                  <PrimaryButton onClick={handleSave} text="Létrehozás" />
                ) : (
                  <DisabledButton text={"Létrehozás"} />
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CalendarNew;
