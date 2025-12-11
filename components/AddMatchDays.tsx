"use client";
import { useEffect, useState, useCallback } from "react";
import AddMatchDaysItem from "./AddMatchDaysItem";
import Skeleton from "./common/Skeleton";
import { Calendar, User } from "@/types/types";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { fetchProfile } from "@/lib/actions/fetchProfile";

/**
 * A component that displays a list of calendars and allows the user to add match days to them.
 * @returns A JSX component that displays a list of calendars and allows the user to add match days to them.
 */
const AddMatchDays = () => {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [profile, setProfile] = useState<User>({} as User);

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? null : id));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCalendars = await fetchCalendars();
      if (fetchedCalendars.success) {
        const sortedCalendars: Calendar[] = fetchedCalendars.data.sort(
          (a: Calendar, b: Calendar) => {
            return new Date(b.days[0]).getTime() - new Date(a.days[0]).getTime();
          }
        );
        setCalendars(sortedCalendars);
      }
      const userProfileResult = await fetchProfile();
      if (userProfileResult.success) {
        setProfile(userProfileResult.data);
      }
    } catch (error) {
      console.error("Hiba az adatok betöltésekor:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddMatchDays;
