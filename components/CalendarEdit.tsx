"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CalendarItem from "./CalendarItem";
import OutlinedButton from "@/components/common/OutlinedButton";
import Spinner from "./common/Spinner";
import { Calendar } from "@/types/types";

const CalendarEdit = ({calendars}: {calendars: Calendar[]}) => {
  const [isOpen, setIsOpen] = useState(0);
  const router = useRouter();

  console.log(calendars)

  const exitEditMode = () => {
    router.push("/dashboard/calendar");
  };

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? 0 : id));

  if (!calendars) return <Spinner />;

  return (
    <section>
      <div className="w-full mb-5">
        {calendars &&
          calendars.map((data, index) => (
            <CalendarItem
              key={index}
              calendar={data}
              isOpen={isOpen === index}
              toggle={toggleOpen(index)}
            />
          ))}
        <div className="px-4 py-3 my-8 text-center sm:px-6">
          <OutlinedButton
            text={"Vissza"}
            type={"button"}
            onClick={exitEditMode}
          />
        </div>
      </div>
    </section>
  );
};

export default CalendarEdit;
