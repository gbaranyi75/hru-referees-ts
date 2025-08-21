"use client";
import { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import DisabledButton from "@/components/common/DisabledButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import DeleteButton from "./common/DeleteButton";
import { updateCalendarData, deleteCalendar } from "@/lib/utils/requests";
import { updateCalendar } from "@/lib/actions/updateCalendar";
import { useRouter } from "next/navigation";
import { Calendar } from "@/types/types";
import { Value } from "react-calendar/dist/shared/types.js";

const CalendarItem = ({
  calendar,
  isOpen,
  toggle,
}: {
  calendar: Calendar;
  isOpen: boolean;
  toggle: () => void;
}) => {
  const currentDates = calendar.days;
  const [dates, setDates] = useState(currentDates);
  const [eventName, setEventName] = useState(calendar.name);
  const [edited, setEdited] = useState(false);
  const [showError, setShowError] = useState(false);
  const [date, setDate] = useState(new Date());
  const [updateCalendarData, setUpdateCalendarData] = useState({
    name: eventName,
    days: dates,
  });
  const days = dates;
  const calendarId = calendar._id;
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const router = useRouter();

  const handleOpenCalendar = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    toggle();
  };

  const exitEditMode = () => {
    router.push("/dashboard/calendar");
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLSpanElement>) => {
    //e.preventDefault();
    if (dates.length !== 0 && eventName !== "") {
      try {
        const res = await updateCalendar(calendarId, updateCalendarData);
        const success = res instanceof Error? false : res.success;
        if (success) {
          exitEditMode();
          setDates([]);
          setEventName("");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowError(true);
    }
  };

  const handleDeleteCalendar = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    try {
      const res = await deleteCalendar(calendarId)
      const success = res instanceof Error? false : res.success;
      if (success) {
        exitEditMode();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const transformDateFormat = (date: Date) => {
    return date.toLocaleDateString("hu-HU", dateFormatOptions);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
    setUpdateCalendarData((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
    if (e.target.value !== "") {
      setEdited(true);
    }
  };

  useEffect(() => {
    setShowError(false);
  }, [dates]);

  return (
    <div className="flex flex-col border-b mx-6 mt-6 bg-white text-gray-600 text-center drop-shadow-md hover:drop-shadow-xl justify-center z-0">
      <div className="flex md:mx-36 py-6 bg-white text-center justify-center">
        <span>
          <h2 className="text-lg mr-1 font-semibold">{eventName}</h2>
        </span>
        <span className="my-auto cursor-pointer" onClick={handleOpenCalendar}>
          {!isOpen ? (
            <MdOutlineExpandMore size={24} />
          ) : (
            <MdOutlineExpandLess size={24} />
          )}
        </span>
      </div>

      {isOpen && (
        <div className="mt-5 md:mx-32 md:mt-0 bg-white md:text-left">
          <form onClick={handleSubmit}>
            <div className="overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6 mb-6">
                  <div className="col-span-6">
                    <label
                      htmlFor="eventName"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Esemény neve
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      value={eventName}
                      id="eventName"
                      autoComplete="eventName"
                      className="px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-solid border border-indigo-50 rounded-md"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:justify-center">
                  <label className="mb-2 mt-6 text-sm font-medium text-gray-700">
                    Időpontok kiválasztása:
                  </label>
                  <ReactCalendar
                    onChange={(date: Value) => {
                      setDate(date);
                      setEdited(true);
                    }}
                    value={date}
                    formatDay={(date: Date) => {
                      return transformDateFormat(date);
                    }}
                    onClickDay={(date) => {
                      if (dates.includes(transformDateFormat(date).toString())) {
                        setDates(dates);
                      } else {
                        days.push(transformDateFormat(date).toString());
                        days.sort();
                        setDates(days, ...dates);
                        setUpdateCalendarData((prevState) => ({
                          ...prevState,
                          days: days,
                        }));
                      }
                    }}
                  />
                  <div className="flex md:flex-row flex-col flex-wrap">
                    {dates.map((day, idx) => {
                      return (
                        <div className="flex my-1" key={idx}>
                          <span
                            id="badge-dismiss-dark"
                            className="inline-flex items-center px-3 py-1 me-2 text-sm text-gray-600 bg-gray-300 rounded-full"
                          >
                            {day}
                            <button
                              type="button"
                              className="inline-flex items-center p-1 ms-2 text-sm text-gray-600 bg-transparent rounded-sm hover:bg-gray-400 hover:text-gray-50"
                              data-dismiss-target="#badge-dismiss-dark"
                              aria-label="Remove"
                              onClick={() => {
                                const modifiedArray = dates.filter(
                                  (day) => dates.indexOf(day) !== idx
                                );
                                setDates(modifiedArray);
                                setUpdateCalendarData((prevState) => ({
                                  ...prevState,
                                  days: modifiedArray,
                                }));
                                setEdited(true);
                              }}
                            >
                              <svg
                                className="w-2 h-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                              <span className="sr-only">Remove date</span>
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {showError && (
                    <p className="mt-2 text-sm text-center text-red-600">
                      Kérlek, add meg a dátumokat!
                    </p>
                  )}
                </div>
                <div className="flex flex-col-reverse md:flex-row justify-between mt-5">
                  <div className="px-4 py-3 md:pl-0 text-center sm:px-6">
                    <OutlinedButton
                      text={"Mégsem"}
                      type={"button"}
                      onClick={exitEditMode}
                    />
                  </div>
                  <div className="px-4 py-3 text-center sm:px-6">
                    <DeleteButton
                      type={"button"}
                      onClick={handleDeleteCalendar}
                      text={"Esemény törlése"}
                    />
                  </div>
                  <div className="px-4 py-3 md:pr-0 text-center sm:px-6">
                    {edited ? (
                      <PrimaryButton type={"submit"} text={"Mentés"} />
                    ) : (
                      <DisabledButton text={"Mentés"} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CalendarItem;
