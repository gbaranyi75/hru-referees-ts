"use client";
import { useEffect, useState } from "react";
import CalendarItem from "./CalendarItem";
import { Calendar } from "@/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";

const CalendarEdit = () => {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [editModeOpen, setEditModeOpen] = useState(false);

  const toggleEditMode = () => {
    setEditModeOpen(!editModeOpen);
  };

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? null : id));

  const fetchCalendarsData = async () => {
    const fetchedCalendars = await fetchCalendars();
    const sortedCalendars: Calendar[] = fetchedCalendars.sort(
      (a: Calendar, b: Calendar) => {
        return new Date(b.days[0]).getTime() - new Date(a.days[0]).getTime();
      }
    );
    if (fetchedCalendars) {
      setCalendars(sortedCalendars);
    }
  };

  useEffect(() => {
    fetchCalendarsData();
  }, []);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-lg font-semibold text-gray-600">
          Táblázatok módosítása
        </h2>
        <button
          onClick={toggleEditMode}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
        >
          <Icon icon="lucide:edit" width="20" height="20" />
          {editModeOpen ? "Mégsem" : "Szerkesztés"}
        </button>
      </div>
      {editModeOpen && (
        <div className="col-span-12">
          {calendars &&
            calendars.map((data, index) => (
              <CalendarItem
                key={index}
                calendar={data}
                isOpen={isOpen === index}
                toggle={toggleOpen(index)}
                toggleEditMode={toggleEditMode}
                fetchCalendarsData={fetchCalendarsData}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CalendarEdit;
