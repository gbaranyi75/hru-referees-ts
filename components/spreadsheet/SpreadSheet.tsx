"use client";
import { useState, useEffect } from "react";
import { useCalendars } from "@/hooks/useCalendars";
import { useUsers } from "@/contexts/UsersContext";
import { fetchAllUserSelections } from "@/lib/actions/fetchAllUserSelections";
import { Calendar, User, UserSelection } from "@/types/models";
import SpreadSheetItem from "./SpreadSheetItem";
import Skeleton from "../common/Skeleton";

const SpreadSheet = () => {
  const { users, loading, error } = useUsers();
  const { data: calendars = [] } = useCalendars();
  const [isTableOpen, setIsTableOpen] = useState<number | null>(null);
  const [selections, setSelections] = useState<Map<string, UserSelection[]>>(
    new Map(),
  );
  const [selectionLoading, setSelectionLoading] = useState(false);

  const toggleOpen = (id: number) => () =>
    setIsTableOpen((isTableOpen) => (isTableOpen === id ? null : id));

  useEffect(() => {
    const fetchData = async () => {
      setSelectionLoading(true);
      try {
        // Batch fetch: all selections at once
        if (calendars.length > 0 && users && users.length > 0) {
          const calendarIds = calendars
            .map((c) => c._id)
            .filter((id): id is string => id !== undefined);
          const selectionsResult = await fetchAllUserSelections(calendarIds);

          if (selectionsResult.success) {
            // Create Map: calendarId -> UserSelection[] (with username added)
            const selectionsMap = new Map<string, UserSelection[]>();
            selectionsResult.data.forEach((selection: UserSelection) => {
              // Assign username from user data
              const user = users.find(
                (u: User) => u.clerkUserId === selection.clerkUserId,
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
        setSelectionLoading(false);
      }
    };
    fetchData();
  }, [users, calendars]);

  if (loading || selectionLoading)
    return (
      <>
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
        <Skeleton className="w-full h-22 mb-2" />
      </>
    );

  if (error)
    return (
      <p className="text-red-500">
        Hiba történt az játékvezetői adatok betöltésekor.
      </p>
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
              initialSelections={data._id ? selections.get(data._id) || [] : []}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default SpreadSheet;
