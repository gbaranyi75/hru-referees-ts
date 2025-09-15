"use client";
import { useState, useEffect } from "react";
import Select, { SelectOption } from "./common/Select";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createMatch } from "@/lib/actions/createMatch";
import { Match, MatchOfficial, User } from "@/types/types";
import { hours } from "@/constants/matchUtils";
import teams from "@/constants/matchData/teams.json";
import types from "@/constants/matchData/matchTypes.json";
import genderOptions from "@/constants/matchData/genderOptions.json";
import ages from "@/constants/matchData/ages.json";
import venues from "@/constants/matchData/venues.json";
import OutlinedButton from "./common/OutlinedButton";
import PrimaryButton from "./common/PrimaryButton";
import Label from "./common/Label";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { hu } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";

const defaultFormFields = {
  type: "" as string,
  home: "" as string,
  away: "" as string,
  gender: "" as string,
  age: "" as string,
  venue: "" as string,
  referee: {} as MatchOfficial,
  referees: [] as MatchOfficial[],
  assist1: {} as MatchOfficial,
  assist2: {} as MatchOfficial,
  controllers: [] as MatchOfficial[],
  date: "" as string,
  time: "" as string,
};

const MatchesNew = ({ referees }: { referees: User[] }) => {
  const [formFields, setFormFields] = useState<Match>(defaultFormFields);
  const [typeValue, setTypeValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [homeValue, setHomeValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [awayValue, setAwayValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [genderValue, setGenderValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [ageValue, setAgeValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [venueValue, setVenueValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [refereeValue, setRefereeValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [assist1Value, setAssist1Value] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [assist2Value, setAssist2Value] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [controllersValue, setControllersValue] = useState<SelectOption[]>(
    [] as SelectOption[]
  );
  const [refereesValue, setRefereesValue] = useState<SelectOption[]>(
    [] as SelectOption[]
  );
  const [timeValue, setTimeValue] = useState<SelectOption | undefined>(
    {} as SelectOption
  );
  const [dateValue, setDateValue] = useState<string | undefined>("" as string);
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [createNewOpen, setCreateNewOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isSingleMatch, setIsSingleMatch] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    home = "",
    away = "",
    type = "",
    gender = "",
    age = "",
    venue = "",
    referee = {} as User,
    assist1 = {} as User,
    assist2 = {} as User,
    controllers = [],
    date = "",
    time = "",
  } = formFields || {};
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const defaultClassNames = getDefaultClassNames();

  const transformDateFormat = (date: Date) => {
    return date.toLocaleDateString("hu-HU", dateFormatOptions);
  };

  useEffect(() => {
    if (selected) {
      const dateString = transformDateFormat(selected).toString();
      setDateValue(dateString);
      setFormFields({
        ...formFields,
        date: dateString || "",
      });
    }
  }, [selected]);

  const handleCalendarOpen = () => {
    setCalendarOpen((state) => !state);
  };

  const handleSubmit = async () => {
    // test type
    if (type === "7s" || type === "UP torna") {
      if (date !== "" && time !== "" && venue !== "") {
        try {
          const res = await createMatch(formFields);
          resetFormFields();
          const success = res instanceof Error ? false : res.success;
          if (success) setIsSuccess(true);
          toast.success("Sikeres mentés");
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.error("Kérlek, tölts ki minden kötelező mezőt");
      }
    } else {
      if (home === away) {
        toast.error("A hazai és a vendég csapat nem lehet ugyanaz");
        return;
      }
      if (
        (referee.username !== "" &&
          assist1.username !== "" &&
          referee.username === assist1.username) ||
        (referee.username !== "" &&
          assist2.username !== "" &&
          referee.username === assist2.username) ||
        (!assist2.username &&
          !assist1.username &&
          assist2.username === assist1.username)
      ) {
        toast.error("A nevek nem egyezhetnek meg");
        return;
      }
      if (controllers.length > 0) {
        controllers.map((c) => {
          if (
            c.username === referee.username ||
            c.username === assist1.username ||
            c.username === assist2.username
          ) {
            toast.error("A nevek nem egyezhetnek meg");
            return;
          }
        });
      }

      if (
        home !== "" &&
        away !== "" &&
        date !== "" &&
        time !== "" &&
        venue !== ""
      ) {
        try {
          const res = await createMatch(formFields);
          const success = res instanceof Error ? false : res.success;
          if (success) setIsSuccess(true);
          toast.success("Sikeres mentés");
          resetFormFields();
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.error("Kérlek, tölts ki minden kötelező mezőt");
      }
    }
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const toggleCreateNew = () => {
    setCreateNewOpen(!createNewOpen);
    //resetToBase();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl lg:p-6 text-gray-600">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-lg font-semibold text-gray-600">
            Új mérkőzés létrehozása
          </h2>
          <button
            onClick={toggleCreateNew}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
          >
            <span className="">
              <Icon icon="lucide:plus" width="20" height="20" />
            </span>
            Létrehozás
          </button>
        </div>

        {createNewOpen && (
          <form className="flex flex-col">
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-x-10 gap-y-5 xl:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Verseny típus:</Label>
                  <Select
                    options={types.map((n) => ({
                      label: n.name,
                      value: n.name,
                      name: "type",
                    }))}
                    placeholder="--Válassz típust--"
                    onChange={(o) => {
                      setTypeValue(o);
                      setFormFields({
                        ...formFields,
                        type: String(o === undefined ? "" : o?.value),
                      });
                      if (o?.value === "7s" || o?.value === "UP torna") {
                        setIsSingleMatch(false);
                      }
                    }}
                    value={typeValue}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Neme:</Label>
                  <Select
                    options={genderOptions.map((n) => ({
                      label: n.name,
                      value: n.name,
                      name: "gender",
                    }))}
                    placeholder="--Válassz nemet--"
                    onChange={(o) => {
                      setGenderValue(o);
                      setFormFields({
                        ...formFields,
                        gender: String(o === undefined ? "" : o?.value),
                      });
                    }}
                    value={genderValue}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Korosztály:</Label>
                  <Select
                    options={ages.map((n) => ({
                      label: n.name,
                      value: n.name,
                      name: "age",
                    }))}
                    placeholder="--Válassz korosztályt--"
                    onChange={(o) => {
                      setAgeValue(o);
                      setFormFields({
                        ...formFields,
                        age: String(o === undefined ? "" : o?.value),
                      });
                    }}
                    value={ageValue}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Helyszín:</Label>
                  <Select
                    options={venues.map((n) => ({
                      label: n.name,
                      value: n.name,
                      name: "venue",
                    }))}
                    placeholder="--Válassz helyszínt--"
                    onChange={(o) => {
                      setVenueValue(o);
                      setFormFields({
                        ...formFields,
                        venue: String(o === undefined ? "" : o?.value),
                      });
                    }}
                    value={venueValue}
                  />
                </div>
                {isSingleMatch && (
                  <>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Hazai:</Label>
                      <Select
                        options={teams.map((n) => ({
                          label: n.name,
                          value: n.name,
                          name: "home",
                        }))}
                        placeholder="--Válassz csapatot--"
                        onChange={(o) => {
                          setHomeValue(o);
                          setFormFields({
                            ...formFields,
                            home: String(o === undefined ? "" : o?.value),
                          });
                        }}
                        value={homeValue}
                      />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Vendég:</Label>
                      <Select
                        options={teams.map((n) => ({
                          label: n.name,
                          value: n.name,
                          name: "away",
                        }))}
                        placeholder="--Válassz csapatot--"
                        onChange={(o) => {
                          setAwayValue(o);
                          setFormFields({
                            ...formFields,
                            away: String(o === undefined ? "" : o?.value),
                          });
                        }}
                        value={awayValue}
                      />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Játékvezető:</Label>
                      <Select
                        options={referees.map((n) => ({
                          label: n.username,
                          value: n.username,
                          id: n.clerkUserId,
                          name: "referee",
                        }))}
                        placeholder="--Válassz játékvezetőt--"
                        onChange={(o) => {
                          setRefereeValue(o);
                          setFormFields({
                            ...formFields,
                            referee: {
                              username: String(o === undefined ? "" : o?.value),
                              clerkUserId: o?.id || "",
                            },
                          });
                        }}
                        value={refereeValue}
                      />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Asszisztens 1:</Label>
                      <Select
                        options={referees.map((n) => ({
                          label: n.username,
                          value: n.username,
                          id: n.clerkUserId,
                          name: "assist1",
                        }))}
                        placeholder="--Válassz asszisztenst--"
                        onChange={(o) => {
                          setAssist1Value(o);
                          setFormFields({
                            ...formFields,
                            assist1: {
                              username: String(o === undefined ? "" : o?.value),
                              clerkUserId: o?.id || "",
                            },
                          });
                        }}
                        value={assist1Value}
                      />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Asszisztens 2:</Label>
                      <Select
                        options={referees.map((n) => ({
                          label: n.username,
                          value: n.username,
                          id: n.clerkUserId,
                          name: "assist2",
                        }))}
                        placeholder="--Válassz asszisztenst--"
                        onChange={(o) => {
                          setAssist2Value(o);
                          setFormFields({
                            ...formFields,
                            assist2: {
                              username: String(o === undefined ? "" : o?.value),
                              clerkUserId: o?.id || "",
                            },
                          });
                        }}
                        value={assist2Value}
                      />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Ellenőr(ök):</Label>
                      <Select
                        multiple
                        options={referees.map((n) => ({
                          label: n.username,
                          value: n.username,
                          id: n.clerkUserId,
                          name: "controllers",
                        }))}
                        placeholder="--Válassz ellenőrt--"
                        onChange={(o) => {
                          setControllersValue(o);
                          setFormFields({
                            ...formFields,
                            controllers: o.map((i) => ({
                              username: String(i.value), // Ensure username is a string
                              clerkUserId: i.id || "", // Provide a fallback to an empty string
                            })),
                          });
                        }}
                        value={controllersValue}
                      />
                    </div>
                  </>
                )}
                {!isSingleMatch && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Játékvezetők:</Label>
                    <Select
                      multiple
                      placeholder="--Válassz játékvezetőket--"
                      options={referees.map((n) => ({
                        label: n.username,
                        value: n.username,
                        id: n.clerkUserId,
                        name: "referees",
                      }))}
                      onChange={(o) => {
                        setRefereesValue(o);
                        setFormFields({
                          ...formFields,
                          referees: o.map((i) => ({
                            username: String(i.value), // Ensure username is a string
                            clerkUserId: i.id || "", // Provide a fallback to an empty string
                          })),
                        });
                      }}
                      value={refereesValue}
                    />
                  </div>
                )}
                <div className="col-span-2 lg:col-span-1">
                  <Label>Időpont:</Label>
                  <Select
                    options={hours.map((n) => ({
                      label: n,
                      value: n,
                      name: "time",
                    }))}
                    placeholder="--Válassz időpontot--"
                    onChange={(o) => {
                      setTimeValue(o);
                      setFormFields({
                        ...formFields,
                        time: String(o === undefined ? "" : o?.value),
                      });
                    }}
                    value={timeValue}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Dátum:</Label>
                  <div
                    onBlur={handleCalendarOpen}
                    onClick={handleCalendarOpen}
                    className="flex overscroll-contain relative h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-300"
                  >
                    <span className="flex flex-1 flex-wrap gap-2 text-gray-600  overflow-hidden">
                      {dateValue ? dateValue : "---Válassz dátumot---"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDateValue("" as string);
                      }}
                      className="cursor-pointer text text-gray-300"
                    >
                      &times;
                    </button>
                    <div className="bg-gray-300 self-stretch w-[2px] ml-2.5"></div>
                    <div className="flex my-auto items-center text-gray-300 pl-2 pt-0.5">
                      <Icon icon="lucide:chevron-down" width="20" height="20" />
                    </div>
                  </div>
                  {calendarOpen && (
                    <div className="flex items-center">
                      <div className="flex overflow-hidden overflow-x-auto justify-center pl-20 md:pl-0 mx-auto mt-1 mb-6 text-sm font-medium text-gray-700">
                        <DayPicker
                          locale={hu}
                          id="day-picker"
                          mode="single"
                          animate
                          navLayout="around"
                          timeZone="Europe/Budapest"
                          showOutsideDays={true}
                          className={"p-3"}
                          selected={selected}
                          onSelect={setSelected}
                          classNames={{
                            root: `${defaultClassNames.root}  border border-gray-200 rounded-xl p-5`,
                            caption_label: `${defaultClassNames.caption_label} text-base font-medium capitalize`,
                            weekday: `${defaultClassNames.weekday} uppercase text-sm`,
                            today: "border border-amber-500",
                            selected:
                              "bg-amber-500  rounded rounded-full text-white bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          }}
                          styles={{
                            head_cell: {
                              width: "0px",
                            },
                            table: {
                              maxWidth: "150px",
                            },
                            day: {
                              margin: "auto",
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 md:mt-10 px-4 py-3 text-center sm:px-6">
                <PrimaryButton
                  onClick={handleSubmit}
                  text={"Mentem a módosításokat"}
                />
              </div>
              <div className="mb-5 md:mb-10 px-4 py-3 text-center sm:px-6">
                <OutlinedButton
                  onClick={toggleCreateNew}
                  type={"button"}
                  text={"Mégse"}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default MatchesNew;
