"use client";
import { useState } from "react";
import CalendarItem from "./CalendarItem";
import { Icon } from "@iconify/react";
import { useCalendars } from "@/hooks/useCalendars";

const CalendarEdit = () => {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [editModeOpen, setEditModeOpen] = useState(false);

  // React Query hook for calendars
  const { data: calendars = [] } = useCalendars();

  const toggleEditMode = () => {
    setEditModeOpen(!editModeOpen);
  };

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? null : id));

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
          {calendars.map((data, index) => (
            <CalendarItem
              key={data._id || index}
              calendar={data}
              isOpen={isOpen === index}
              toggle={toggleOpen(index)}
              toggleEditMode={toggleEditMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarEdit;
