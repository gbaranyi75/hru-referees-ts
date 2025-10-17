"use client";
import { useState, useEffect } from "react";
import SpreadSheetItem from "./SpreadSheetItem";
import Skeleton from "./common/Skeleton";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { Calendar, User } from "@/types/types";

const SpreadSheet = () => {
  const [isTableOpen, setIsTableOpen] = useState(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [referees, setReferees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleOpen = (id: any) => () =>
    setIsTableOpen((isTableOpen) => (isTableOpen === id ? null : id));

  const fetchCalendarsData = async () => {
    setLoading(true);
    const fetchedCalendars = await fetchCalendars();
    let sortedCalendars: Calendar[] = fetchedCalendars.sort((a: Calendar, b: Calendar) => {
      return new Date(b.days[0]).getTime() - new Date(a.days[0]).getTime();
    });
    const usersData = await fetchUsers();
    setCalendars(sortedCalendars);

    setReferees(usersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCalendarsData();
  }, []);

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
      </>
    );

  return (
    <div className="col-span-12">
      {calendars.length === 0 ? (
        <p>Nem találtam táblázatot!</p>
      ) : (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 mt-5">
          {calendars.map((data: Calendar, index: number) => (
            <SpreadSheetItem
              key={index}
              calendar={data}
              users={referees}
              isTableOpen={isTableOpen === index}
              toggle={toggleOpen(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default SpreadSheet;
