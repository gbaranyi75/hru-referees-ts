"use client";
import { useEffect, useState } from "react";
import AddMatchDaysItem from "./AddMatchDaysItem";
import Skeleton from "./common/Skeleton";
import { Calendar, User } from "@/types/types";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { fetchProfile } from "@/lib/actions/fetchProfile";

const AddMatchDays = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [profile, setProfile] = useState<User>({} as User);

  const toggleOpen = (id: any) => () =>
    setIsOpen((isOpen) => (isOpen === id ? 0 : id));

  const fetchData = async () => {
    setLoading(true);
    const fetchedCalendars = await fetchCalendars();
    const userProfile = await fetchProfile();
    setCalendars(fetchedCalendars);
    setProfile(userProfile);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
