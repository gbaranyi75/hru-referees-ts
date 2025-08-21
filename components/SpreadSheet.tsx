"use client";
import { useState, useEffect } from "react";
import SpreadSheetItem from "./SpreadSheetItem";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
//import { fetchUsers } from "@/lib/actions/fetchUsers";
import { Calendar } from "@/types/types";
import { User } from "@/types/types";

const SpreadSheet = ({ users }: { users: User[] }) => {
  const [isOpen, setIsOpen] = useState(0);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  //const [users, setUsers] = useState<User[]>([]);
  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? 0 : id));
  /* const fetchUsersData = async () => {
    const fetchedUsers = await fetchUsers();
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  } */ const fetchCalendarsData = async () => {
    const fetchedCalendars = await fetchCalendars();
    if (fetchedCalendars) {
      setCalendars(fetchedCalendars);
    }
  };

  useEffect(() => {
    fetchCalendarsData();
    //fetchUsersData();
  }, []);

  return (
    <section>
      <div className="w-full mb-5">
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
    </section>
  );
};
export default SpreadSheet;
