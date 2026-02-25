"use client";
import { useEffect, useState } from "react";
import AddMatchDaysItem from "./AddMatchDaysItem";
import Skeleton from "../common/Skeleton";
import { User, UserSelection } from "@/types/models";
import { fetchProfile } from "@/lib/actions/profileActions";
import { fetchUserSelections } from "@/lib/actions/userSelectionActions";
import { useCalendars } from "@/hooks/useCalendars";

/**
 * A component that displays a list of calendars and allows the user to add match days to them.
 * @returns A JSX component that displays a list of calendars and allows the user to add match days to them.
 */
const AddMatchDays = () => {
  const { data: calendars = [] } = useCalendars();
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User>({} as User);
  const [selections, setSelections] = useState<Map<string, UserSelection>>(
    new Map(),
  );

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? null : id));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileResult = await fetchProfile();
        if (!profileResult.success) {
          console.error("Failed to fetch profile:", profileResult.error);
          setLoading(false);
          return;
        }
        
        setProfile(profileResult.data);
        
        // Batch fetch: all selections at once (only if calendars and profile exist)
        if (
          calendars.length > 0 &&
          profileResult.data?.clerkUserId
        ) {
          const calendarIds = calendars
            .map((c) => c._id)
            .filter((id): id is string => id !== undefined && id !== "");
          
          if (calendarIds.length === 0) {
            setLoading(false);
            return;
          }
          
          const selectionsResult = await fetchUserSelections(
            calendarIds,
            profileResult.data.clerkUserId,
          );

          if (selectionsResult.success) {
            // Create Map for fast lookup
            const selectionsMap = new Map<string, UserSelection>();
            selectionsResult.data.forEach((selection: UserSelection) => {
              if (selection.calendarId) {
                selectionsMap.set(selection.calendarId, selection);
              }
            });
            setSelections(selectionsMap);
          } else {
            console.error("Failed to fetch selections:", selectionsResult.error);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [calendars]);

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-20 mb-3" />
        <Skeleton className="w-full h-20 mb-3" />
        <Skeleton className="w-full h-20 mb-3" />
      </>
    );

  return (
    <div className="col-span-12">
      {calendars.length === 0 ? (
        <p>Nem találtam táblázatot!</p>
      ) : (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 mt-5">
          {calendars.map((calendar, index) => (
            <AddMatchDaysItem
              key={calendar._id}
              calendar={calendar}
              profile={profile}
              isOpen={isOpen === index}
              toggle={toggleOpen(index)}
              initialSelection={
                calendar._id ? selections.get(calendar._id) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddMatchDays;
