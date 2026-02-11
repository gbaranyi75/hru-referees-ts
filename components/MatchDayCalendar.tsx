"use client";

import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import clsx from "clsx";
import Cell from "./common/Cell";
import { Calendar } from "@/types/types";

const weeks = [
  "Hétfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
  "Vasárnap",
];

type Props = {
  calendar: Calendar;
  selectedDates: string[];
  handleDateSelect: (date: string) => void;
};

const MatchDayCalendar: React.FC<Props> = ({
  calendar,
  handleDateSelect,
  selectedDates,
}) => {
  const value = calendar.days[0];

  const eventDays = calendar.days;

  const currentDate = new Date(value as string);

  const firstDayOfMonth = startOfMonth(currentDate);

  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;

  const endingDayIndex =
    7 - getDay(lastDayOfMonth) === 7 ? 0 : 7 - getDay(lastDayOfMonth);

  const eventsByDate = useMemo(() => {
    return eventDays.reduce((acc: { [key: string]: string[] }, event) => {
      const dateKey = format(event, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
  }, [eventDays]);

  return (
    <div className="max-w-full border-t border-l border-gray-300 m-4">
      <div className="grid grid-cols-7 items-center border-gray-300 justify-center text-center">
        {weeks.map((week) => (
          <Cell
            key={week}
            className="text-xs border-gray-300 bg-purple-100 font-bold uppercase py-2 justify-center"
          >
            {week}
          </Cell>
        ))}

        {Array.from({ length: startingDayIndex }).map((_, index) => {
          return (
            <Cell
              key={`empty-${index}`}
              className="h-26 border-r border-b p-2 border-gray-300 text-center min-h-12.5 bg-gray-100"
            />
          );
        })}

        {daysInMonth.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const todaysEvents = eventsByDate[dateKey] || [];
          return (
            <Cell
              key={index}
              className={clsx(
                "flex flex-col text-left border-r border-b p-2 border-gray-300 h-26",
                {
                  "bg-blue-200": isToday(day),
                  "text-gray-900": isToday(day),
                }
              )}
            >
              <span className="flex text-left text-sm">{format(day, "d")}</span>
              {todaysEvents.map((event, eventIndex) => {
                return (
                  <div className="flex my-auto" key={`${dateKey}-${eventIndex}`}>
                    <span className="text-[10px] w-full">
                      <button
                        type="button"
                        className={
                          !selectedDates?.includes(event)
                            ? "inline-flex font-normal cursor-pointer justify-center p-2 text-red-800 bg-red-100 hover:bg-red-300 w-full rounded-sm border-l-4 border-red-600"
                            : "inline-flex font-normal cursor-pointer justify-center p-2 text-green-800 bg-green-100 hover:bg-green-300 w-full rounded-sm border-l-4 border-green-600"
                        }
                        onClick={() => {
                          handleDateSelect(event);
                        }}
                      >
                        {event}
                      </button>
                    </span>
                  </div>
                );
              })}
            </Cell>
          );
        })}

        {Array.from({ length: endingDayIndex }).map((_, index) => {
          return (
            <Cell
              key={`empty-${index}`}
              className="border-r border-b p-2 border-gray-300 text-center min-h-12.5 h-26 bg-gray-100"
            />
          );
        })}
      </div>
    </div>
  );
};

export default MatchDayCalendar;
