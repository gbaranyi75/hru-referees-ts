"use client";
import { useState } from "react";
import AddMatchDaysItem from "./AddMatchDaysItem";
import Spinner from "./common/Spinner";
import { Calendar, User } from "@/types/types";

const AddMatchDays = ({
  calendars,
  profile,
}: {
  calendars: Calendar[];
  profile: User;
}) => {
  const [isOpen, setIsOpen] = useState(0);

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? 0 : id));

  if (!calendars) return <Spinner />;

  return (
    <section className="md:px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {calendars.length === 0 ? (
          <p>Nem találtam táblázatot!</p>
        ) : (
          <div className="">
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
    </section>
  );
};

export default AddMatchDays;
