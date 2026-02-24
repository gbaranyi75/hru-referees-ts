"use client";

import { useMemo, useState, useEffect } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  isValid,
} from "date-fns";
import clsx from "clsx";
import Cell from "../common/Cell";
import { Calendar } from "@/types/models";

const weeks = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SEGÉDFÜGGVÉNY: A "2026. 02. 14." -> "2026-02-14" átalakításhoz
  const normalizeDate = (dateStr: string) => {
    return dateStr.replace(/\.\s/g, "-").replace(/\./g, "").trim();
  };

  // 1. A HÓNAP MEGHATÁROZÁSA (iPhone kompatibilis formátumra hozva)
  const currentDate = useMemo(() => {
    if (!calendar?.days || calendar.days.length === 0) return new Date();
    const firstVal = String(calendar.days[0]);
    const safeDateString = normalizeDate(firstVal);
    const parsed = new Date(safeDateString);
    return isValid(parsed) ? parsed : new Date();
  }, [calendar?.days]);

  // 2. ESEMÉNYEK CSOPORTOSÍTÁSA
  const eventsByDate = useMemo(() => {
    if (!calendar?.days) return {};

    return calendar.days.reduce((acc: { [key: string]: string[] }, event) => {
      const eventString = String(event);
      const dateKey = normalizeDate(eventString);
      
      if (dateKey) {
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(eventString);
      }
      return acc;
    }, {});
  }, [calendar?.days]);

  if (!mounted) return <div className="p-4 text-center italic">Betöltés...</div>;

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const startingDayIndex = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;
  const endingDayIndex = 7 - getDay(lastDayOfMonth) === 7 ? 0 : 7 - getDay(lastDayOfMonth);

  return (
    <div className="max-w-full border-t border-l border-gray-300 m-4 shadow-sm">
      <div className="grid grid-cols-7 text-center">
        {weeks.map((week) => (
          <Cell key={week} className="text-xs justify-center bg-purple-100 font-bold py-2 border-r border-b border-gray-300 uppercase">
            {week}
          </Cell>
        ))}

        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <Cell key={`empty-s-${i}`} className="h-26 border-r border-b border-gray-300 bg-gray-50" />
        ))}

        {daysInMonth.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const todaysEvents = eventsByDate[dateKey] || [];

          return (
            <Cell
              key={dateKey}
              className={clsx(
                "flex flex-col text-left border-r border-b p-2 border-gray-300 h-26",
                isToday(day) && "bg-blue-50"
              )}
            >
              <span className={clsx("text-sm font-semibold", isToday(day) && "text-blue-600")}>
                {format(day, "d")}
              </span>
              
              <div className="flex flex-col gap-1 mt-1">
                {todaysEvents.map((event, eventIndex) => {
                  const isSelected = selectedDates?.includes(event);
                  // Megjelenítéshez is átalakítjuk a gomb feliratát
                  const displayDate = normalizeDate(event);

                  return (
                    <button
                      key={eventIndex}
                      type="button"
                      onClick={() => handleDateSelect(event)}
                      className={clsx(
                        "text-[10px] w-full p-2 rounded-sm border-l-4 transition-all shadow-sm font-medium",
                        isSelected
                          ? "text-green-800 bg-green-100 border-green-600"
                          : "text-red-800 bg-red-100 border-red-600"
                      )}
                    >
                      {displayDate}
                    </button>
                  );
                })}
              </div>
            </Cell>
          );
        })}

        {Array.from({ length: endingDayIndex }).map((_, i) => (
          <Cell key={`empty-e-${i}`} className="border-r border-b border-gray-300 bg-gray-50 h-26" />
        ))}
      </div>
    </div>
  );
};

export default MatchDayCalendar;