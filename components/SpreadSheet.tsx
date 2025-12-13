"use client";
import { useState, useEffect } from "react";
import SpreadSheetItem from "./SpreadSheetItem";
import Skeleton from "./common/Skeleton";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { fetchAllUserSelections } from "@/lib/actions/fetchAllUserSelections";
import { Calendar, User, UserSelection } from "@/types/types";

const SpreadSheet = () => {
  const [isTableOpen, setIsTableOpen] = useState<number | null>(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [selections, setSelections] = useState<Map<string, UserSelection[]>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);

  const toggleOpen = (id: number) => () =>
    setIsTableOpen((isTableOpen) => (isTableOpen === id ? null : id));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Parallel fetch - calendars and users at once
        const [calendarsResult, usersResult] = await Promise.all([
          fetchCalendars(),
          fetchUsers(),
        ]);

        let sortedCalendars: Calendar[] = [];

        if (calendarsResult.success) {
          sortedCalendars = calendarsResult.data.sort(
            (a: Calendar, b: Calendar) => {
              return (
                new Date(b.days[0]).getTime() - new Date(a.days[0]).getTime()
              );
            }
          );
          setCalendars(sortedCalendars);
        }

        // Batch fetch: all selections at once
        if (sortedCalendars.length > 0 && usersResult.success) {
          const calendarIds = sortedCalendars
            .map((c) => c._id)
            .filter((id): id is string => id !== undefined);
          const selectionsResult = await fetchAllUserSelections(calendarIds);

          if (selectionsResult.success) {
            // Create Map: calendarId -> UserSelection[] (with username added)
            const selectionsMap = new Map<string, UserSelection[]>();
            selectionsResult.data.forEach((selection: UserSelection) => {
              // Assign username from user data
              const user = usersResult.data.find(
                (u: User) => u.clerkUserId === selection.clerkUserId
              );
              const selectionWithUsername = {
                ...selection,
                username: user?.username || selection.username,
              };

              const existing = selectionsMap.get(selection.calendarId) || [];
              selectionsMap.set(selection.calendarId, [
                ...existing,
                selectionWithUsername,
              ]);
            });
            setSelections(selectionsMap);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
              key={data._id || index}
              calendar={data}
              isTableOpen={isTableOpen === index}
              toggle={toggleOpen(index)}
              initialSelections={
                data._id ? selections.get(data._id) || [] : []
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default SpreadSheet;
