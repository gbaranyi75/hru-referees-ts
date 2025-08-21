"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { toast } from "react-toastify";

import DisabledButton from "@/components/common/DisabledButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { createNewCalendar } from "@/lib/actions/createCalendar";

const CalendarNew = () => {
  const { session } = useSession();
  const [dates, setDates] = useState([]);
  const [eventName, setEventName] = useState("");
  const [edited, setEdited] = useState(false);
  const [showErrorName, setShowErrorName] = useState(false);
  const [showErrorDate, setShowErrorDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [newCalendar, setNewCalendar] = useState({
    name: "",
    days: [],
  });
  const router = useRouter();
  const days = dates;
  const dateFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const exitEditMode = () => {
    toast.success("Sikeres mentés");
    router.push("/dashboard/calendar");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dates.length !== 0 && eventName !== "") {
      try {
        if (!session) {
          return;
        }
        await createNewCalendar(newCalendar).then(exitEditMode());
        setDates([]);
        setEventName("");
      } catch (error) {
        console.error(error);
      }
    } else if (eventName === "") {
      setShowErrorName(true);
    } else if (dates.length === 0) {
      setShowErrorDate(true);
    }
  };

  const handleChange = (e) => {
    setEventName(e.target.value);
    setNewCalendar((prevState) => ({ ...prevState, name: e.target.value }));
    if (e.target.value !== "") {
      setEdited(true);
    }
  };

  const transformDateFormat = (date) => {
    return date.toLocaleDateString("hu-HU", dateFormatOptions);
  };

  useEffect(() => {
    setShowErrorDate(false);
  }, [dates]);

  useEffect(() => {
    setShowErrorName(false);
  }, [eventName]);

  return (
    <div className="mt-5 md:mx-32 md:mt-0 bg-white md:text-left">
      <form onSubmit={handleSubmit} action="POST">
        <div className="overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="eventName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Esemény neve
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={eventName}
                  id="eventName"
                  autoComplete="eventName"
                  className="mt-1 px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-solid border border-indigo-50 rounded-md"
                  onChange={handleChange}
                />
              </div>
            </div>
            {showErrorName && (
              <div className="flex flex-col md:justify-center">
                <p className="mt-2 text-sm text-center text-red-600">
                  Kérlek, add meg a nevet
                </p>
              </div>
            )}
            <div className="flex flex-col md:justify-center">
              <label className="mb-2 mt-6 text-sm font-medium text-gray-700">
                Időpontok kiválasztása:
              </label>

              <div className="mx-auto mb-6 text-sm font-medium text-gray-700">
                <Calendar
                  onChange={(date) => {
                    setDate(date);
                    setEdited(true);
                  }}
                  value={date}
                  formatDate={(date) => {
                    transformDateFormat(date);
                  }}
                  onClickDay={(date) => {
                    if (dates.includes(transformDateFormat(date).toString())) {
                      setDates(dates);
                    } else {
                      days.push(transformDateFormat(date).toString());
                      days.sort();
                      setDates(days, ...dates);
                      setNewCalendar((prevState) => ({
                        ...prevState,
                        days: days,
                      }));
                    }
                  }}
                />
              </div>
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
                            setNewCalendar((prevState) => ({
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
              {showErrorDate && (
                <p className="mt-2 text-sm text-center text-red-600">
                  Kérlek, add meg a dátumokat!
                </p>
              )}
            </div>
            <div className="flex flex-col md:flex-row-reverse justify-around mt-5">
              <div className="px-4 py-3 text-center sm:px-6">
                {edited ? (
                  <PrimaryButton type={"submit"} text={"Létrehozás"} />
                ) : (
                  <DisabledButton text={"Létrehozás"} />
                )}
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                <OutlinedButton
                  text={"Vissza"}
                  type={"button"}
                  onClick={exitEditMode}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CalendarNew;
