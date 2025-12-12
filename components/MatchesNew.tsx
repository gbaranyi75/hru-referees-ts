"use client";
import { useState, useEffect, useCallback } from "react";
import Select, { SelectOption } from "./common/Select";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { hu } from "react-day-picker/locale";
import { createMatch } from "@/lib/actions/createMatch";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { fetchGuestUsers } from "@/lib/actions/fetchGuestUser";
import { GuestUser, Match, MatchOfficial, User } from "@/types/types";
import { hours } from "@/constants/matchUtils";
import teams from "@/constants/matchData/teams.json";
import types from "@/constants/matchData/matchTypes.json";
import genderOptions from "@/constants/matchData/genderOptions.json";
import ages from "@/constants/matchData/ages.json";
import venues from "@/constants/matchData/venues.json";
import OutlinedButton from "./common/OutlinedButton";
import PrimaryButton from "./common/PrimaryButton";
import Label from "./common/Label";

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

const MatchesNew = () => {
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
  const [createNewOpen, setCreateNewOpen] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [isSingleMatch, setIsSingleMatch] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [referees, setReferees] = useState<(User | GuestUser)[]>([]);
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

  const defaultClassNames = getDefaultClassNames();

  const transformDateFormat = useCallback((date: Date) => {
    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return date.toLocaleDateString("hu-HU", dateFormatOptions);
  }, []);

  useEffect(() => {
    if (selected) {
      const dateString = transformDateFormat(selected).toString();
      setDateValue(dateString);
      setFormFields((prev) => ({
        ...prev,
        date: dateString || "",
      }));
    }
  }, [selected, transformDateFormat]);

  const handleCalendarOpen = () => {
    setCalendarOpen((state) => !state);
  };

  const handleEmailSend = async () => {
    const list: {
      username: string;
      clerkUserId: string;
      email: string | undefined;
      messageData: Match;
    }[] = [];

    if (formFields.referee.clerkUserId) {
      list.push({
        username: formFields.referee.username,
        clerkUserId: formFields.referee.clerkUserId,
        email: formFields.referee.email,
        messageData: formFields,
      });
    }
    if (formFields.assist1.clerkUserId) {
      list.push({
        username: formFields.assist1.username,
        clerkUserId: formFields.assist1.clerkUserId,
        email: formFields.assist1.email,
        messageData: formFields,
      });
    }
    if (formFields.assist2.clerkUserId) {
      list.push({
        username: formFields.assist2.username,
        clerkUserId: formFields.assist2.clerkUserId,
        email: formFields.assist2.email,
        messageData: formFields,
      });
    }
    if (formFields.controllers.length > 0) {
      formFields.controllers.forEach((controller) => {
        if (controller.clerkUserId) {
          list.push({
            username: controller.username,
            clerkUserId: controller.clerkUserId,
            email: controller.email,
            messageData: formFields,
          });
        }
      });
    }
    if (formFields.referees.length > 0) {
      formFields.referees.forEach((referee) => {
        if (referee.clerkUserId) {
          list.push({
            username: referee.username,
            clerkUserId: referee.clerkUserId,
            email: referee.email,
            messageData: formFields,
          });
        }
      });
    }

    // Using Promise.allSettled to attempt sending all emails even if some fail.
    // This ensures all recipients are attempted rather than stopping at the first failure.
    const results = await Promise.allSettled(
      list.map(async (l) => {
        const resp = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: l.email,
            username: l.username,
            messageData: l.messageData,
            subject: "Új küldés",
          }),
        });
        if (!resp.ok) {
          throw new Error(`${l.email}`);
        }
        return l.email;
      })
    );

    // Collect failed emails for user feedback
    const failedEmails = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected"
      )
      .map((result) => result.reason?.message || "Ismeretlen email");

    if (failedEmails.length > 0) {
      console.error(
        "Email küldés sikertelen a következő címekre:",
        failedEmails
      );
      toast.error(`Email küldés sikertelen: ${failedEmails.join(", ")}`);
    } else if (list.length > 0) {
      toast.success("Minden email sikeresen elküldve");
    }
  };

  const handleSubmit = async () => {
    // test type xxx Not single matches
    if (type === "7s" || type === "UP torna") {
      if (date !== "" && time !== "" && venue !== "") {
        try {
          const res = await createMatch(formFields);
          const success = res instanceof Error ? false : res.success;

          if (success) {
            handleEmailSend();
            setIsSuccess(true);
            toast.success("Sikeres mentés");
            resetFormFields();
            toggleCreateNew();
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.error("Kérlek, tölts ki minden kötelező mezőt");
      }
    }
    // Single match
    else {
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
          referee.username === assist2.username)
      ) {
        toast.error("A nevek nem egyezhetnek meg");
        return;
      }

      if (controllers.length > 0) {
        const hasDuplicate = controllers.some(
          (c) =>
            c.username === referee.username ||
            c.username === assist1.username ||
            c.username === assist2.username
        );
        if (hasDuplicate) {
          toast.error("A nevek nem egyezhetnek meg");
          return;
        }
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
          if (success) {
            handleEmailSend();
            setIsSuccess(true);
            toast.success("Sikeres mentés");
            resetFormFields();
            toggleCreateNew();
          }
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
    setControllersValue([]);
    setRefereesValue([]);
    setTypeValue(undefined);
    setHomeValue(undefined);
    setAwayValue(undefined);
    setGenderValue(undefined);
    setAgeValue(undefined);
    setVenueValue(undefined);
    setRefereeValue(undefined);
    setAssist1Value(undefined);
    setAssist2Value(undefined);
    setDateValue("");
    setTimeValue(undefined);
    setSelected(undefined);
    setIsSingleMatch(true);
  };

  const getUsers = async () => {
    try {
      const guestUsersResult = await fetchGuestUsers();
      const usersResult = await fetchUsers();
      const guestUsersData = guestUsersResult.success
        ? guestUsersResult.data
        : [];
      const usersData = usersResult.success ? usersResult.data : [];
      setReferees([...usersData, ...guestUsersData]);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCreateNew = () => {
    setCreateNewOpen(!createNewOpen);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl lg:p-6 text-gray-600">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-lg font-semibold text-gray-600">
            Új mérkőzés létrehozása
          </h2>
          <button
            onClick={toggleCreateNew}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto">
            <span className="">
              <Icon
                icon="lucide:plus"
                width="20"
                height="20"
              />
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
                      setFormFields((prev) => ({
                        ...prev,
                        type: String(o === undefined ? "" : o?.value),
                      }));
                      if (o?.value === "7s" || o?.value === "UP torna") {
                        setIsSingleMatch(false);
                      } else {
                        setIsSingleMatch(true);
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
                      setFormFields((prev) => ({
                        ...prev,
                        gender: String(o === undefined ? "" : o?.value),
                      }));
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
                      setFormFields((prev) => ({
                        ...prev,
                        age: String(o === undefined ? "" : o?.value),
                      }));
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
                      setFormFields((prev) => ({
                        ...prev,
                        venue: String(o === undefined ? "" : o?.value),
                      }));
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
                          setFormFields((prev) => ({
                            ...prev,
                            home: String(o === undefined ? "" : o?.value),
                          }));
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
                          setFormFields((prev) => ({
                            ...prev,
                            away: String(o === undefined ? "" : o?.value),
                          }));
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
                          email: "email" in n ? n.email : "",
                          id: "clerkUserId" in n ? n.clerkUserId : "",
                          name: "referee",
                        }))}
                        placeholder="--Válassz játékvezetőt--"
                        onChange={(o) => {
                          setRefereeValue(o);
                          setFormFields((prev) => ({
                            ...prev,
                            referee: {
                              username: String(o === undefined ? "" : o?.value),
                              clerkUserId: o?.id || "",
                              email: o?.email || "",
                            },
                          }));
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
                          email: "email" in n ? n.email : "",
                          id: "clerkUserId" in n ? n.clerkUserId : "",
                          name: "assist1",
                        }))}
                        placeholder="--Válassz asszisztenst--"
                        onChange={(o) => {
                          setAssist1Value(o);
                          setFormFields((prev) => ({
                            ...prev,
                            assist1: {
                              username: String(o === undefined ? "" : o?.value),
                              clerkUserId: o?.id || "",
                              email: o?.email || "",
                            },
                          }));
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
                          email: "email" in n ? n.email : "",
                          id: "clerkUserId" in n ? n.clerkUserId : "",
                          name: "assist2",
                        }))}
                        placeholder="--Válassz asszisztenst--"
                        onChange={(o) => {
                          setAssist2Value(o);
                          setFormFields((prev) => ({
                            ...prev,
                            assist2: {
                              username: String(o === undefined ? "" : o?.value),
                              clerkUserId: o?.id || "",
                              email: o?.email || "",
                            },
                          }));
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
                          email: "email" in n ? n.email : "",
                          id: "clerkUserId" in n ? n.clerkUserId : "",
                          name: "controllers",
                        }))}
                        placeholder="--Válassz ellenőrt--"
                        onChange={(o) => {
                          setControllersValue(o);
                          setFormFields((prev) => ({
                            ...prev,
                            controllers: o.map((i) => ({
                              username: String(i.value),
                              clerkUserId: i.id || "",
                              email: i.email || "",
                            })),
                          }));
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
                        email: "email" in n ? n.email : "",
                        id: "clerkUserId" in n ? n.clerkUserId : "",
                        name: "referees",
                      }))}
                      onChange={(o) => {
                        setRefereesValue(o);
                        setFormFields((prev) => ({
                          ...prev,
                          referees: o.map((i) => ({
                            username: String(i.value),
                            clerkUserId: i.id || "",
                            email: i.email || "",
                          })),
                        }));
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
                      setFormFields((prev) => ({
                        ...prev,
                        time: String(o === undefined ? "" : o?.value),
                      }));
                    }}
                    value={timeValue}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Dátum:</Label>
                  <div
                    onBlur={handleCalendarOpen}
                    onClick={handleCalendarOpen}
                    className="flex overscroll-contain relative h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-300">
                    <span className="flex flex-1 flex-wrap gap-2 text-gray-600  overflow-hidden">
                      {dateValue ? dateValue : "---Válassz dátumot---"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDateValue("" as string);
                        setSelected(undefined);
                        setFormFields((prev) => ({ ...prev, date: "" }));
                      }}
                      className="cursor-pointer text text-gray-300">
                      &times;
                    </button>
                    <div className="bg-gray-300 self-stretch w-0.5 ml-2.5"></div>
                    <div className="flex my-auto items-center text-gray-300 pl-2 pt-0.5">
                      <Icon
                        icon="lucide:chevron-down"
                        width="20"
                        height="20"
                      />
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
                  text={"Mentés"}
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
