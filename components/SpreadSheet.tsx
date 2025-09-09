"use client";
import { useState, useEffect } from "react";
import SpreadSheetItem from "./SpreadSheetItem";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { Calendar } from "@/types/types";
import { User } from "@/types/types";
import Skeleton from "./common/Skeleton";
import { fetchUsers } from "@/lib/actions/fetchUsers";

const SpreadSheet = () => {
  const [isOpen, setIsOpen] = useState(0);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [referees, setReferees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? 0 : id));

  const fetchCalendarsData = async () => {
    setLoading(true);
    const fetchedCalendars = await fetchCalendars();
    const usersData = await fetchUsers();
    setCalendars(fetchedCalendars);

    setReferees(usersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCalendarsData();
  }, []);

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
      </>
    );

  return (
    <div className="col-span-12">
      {calendars.map((data: Calendar, index: number) => (
        <SpreadSheetItem
          key={index}
          calendar={data}
          users={referees}
          isOpen={isOpen === index}
          toggle={toggleOpen(index)}
        />
      ))}
    </div>
  );
};
export default SpreadSheet;
