"use client";
import { useState, useEffect } from "react";
import SpreadSheetItem from "./SpreadSheetItem";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { Calendar } from "@/types/types";
import { User } from "@/types/types";
import Skeleton from "./common/Skeleton";

const SpreadSheet = ({ users }: { users: User[] }) => {
  const [isOpen, setIsOpen] = useState(0);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? 0 : id));

  const fetchCalendarsData = async () => {
    const fetchedCalendars = await fetchCalendars();
    if (fetchedCalendars) {
      setCalendars(fetchedCalendars);
    }
  };

  useEffect(() => {
    fetchCalendarsData();
  }, []);

  if (!calendars)
    return (
      <Skeleton className="flex flex-col border-b border-gray-300 mx-6 mt-5 h-12 bg-white text-gray-600 text-center drop-shadow-md hover:drop-shadow-xl justify-center z-0" />
    );

  return (
    <div className="col-span-12">
      {calendars.map((data: Calendar, index: number) => (
        <SpreadSheetItem
          key={index}
          calendar={data}
          users={users}
          isOpen={isOpen === index}
          toggle={toggleOpen(index)}
        />
      ))}
    </div>
  );
};
export default SpreadSheet;
