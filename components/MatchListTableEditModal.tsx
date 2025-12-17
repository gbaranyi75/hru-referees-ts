"use client";
import { useState, useEffect, useCallback } from "react";
import Select, { SelectOption } from "./common/Select";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
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
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { hu } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import updateMatch from "@/lib/actions/updateMatch";
import {
  validateNonSingleMatch,
  validateSingleMatch,
} from "@/lib/utils/matchValidation";

const MatchItemEditModal = ({
  referees,
  closeModal,
  selectedMatch,
  loadMatches,
}: {
  referees: (User | GuestUser)[];
  closeModal: () => void;
  selectedMatch: Match | null;
  loadMatches: () => void;
}) => {
  const defaultFormFields = {
    type: selectedMatch?.type as string,
    home: selectedMatch?.home as string,
    away: selectedMatch?.away as string,
    gender: selectedMatch?.gender as string,
    age: selectedMatch?.age as string,
    venue: selectedMatch?.venue as string,
    referee: (selectedMatch?.referee as MatchOfficial) || "",
    referees: (selectedMatch?.referees as MatchOfficial[]) || [],
    assist1: (selectedMatch?.assist1 as MatchOfficial) || "",
    assist2: (selectedMatch?.assist2 as MatchOfficial) || "",
    controllers: (selectedMatch?.controllers as MatchOfficial[]) || [],
    date: selectedMatch?.date as string,
    time: selectedMatch?.time as string,
  };
  const [formFields, setFormFields] = useState<Match>(defaultFormFields);
  const [typeValue, setTypeValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.type,
    label: selectedMatch?.type,
  } as SelectOption);
  const [homeValue, setHomeValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.home,
    label: selectedMatch?.home,
  } as SelectOption);
  const [awayValue, setAwayValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.away,
    label: selectedMatch?.away,
  } as SelectOption);
  const [genderValue, setGenderValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.gender,
    label: selectedMatch?.gender,
  } as SelectOption);
  const [ageValue, setAgeValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.age,
    label: selectedMatch?.age,
  } as SelectOption);
  const [venueValue, setVenueValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.venue,
    label: selectedMatch?.venue,
  } as SelectOption);
  const [refereeValue, setRefereeValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.referee?.username,
    label: selectedMatch?.referee?.username,
  } as SelectOption);
  const [assist1Value, setAssist1Value] = useState<SelectOption | undefined>({
    value: selectedMatch?.assist1?.username,
    label: selectedMatch?.assist1?.username,
  } as SelectOption);
  const [assist2Value, setAssist2Value] = useState<SelectOption | undefined>({
    value: selectedMatch?.assist2?.username,
    label: selectedMatch?.assist2?.username,
  } as SelectOption);
  const [controllersValue, setControllersValue] = useState<SelectOption[]>(
    selectedMatch?.controllers?.map((controller) => ({
      value: controller.username || undefined,
      label: controller.username || undefined,
      id: controller.clerkUserId || undefined,
    })) as SelectOption[]
  );
  const [refereesValue, setRefereesValue] = useState<SelectOption[]>(
    selectedMatch?.referees?.map((ref) => ({
      value: ref.username || undefined,
      label: ref.username || undefined,
      id: ref.clerkUserId || undefined,
    })) as SelectOption[]
  );
  const [timeValue, setTimeValue] = useState<SelectOption | undefined>({
    value: selectedMatch?.time,
    label: selectedMatch?.time,
  } as SelectOption);
  const [dateValue, setDateValue] = useState<string | undefined>(
    selectedMatch?.date as string
  );
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isSingleMatch, setIsSingleMatch] = useState(
    selectedMatch?.type !== "7s" && selectedMatch?.type !== "UP torna"
      ? true
      : false
  );

  const { type = "" } = formFields || {};

  /* const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }; */

  const defaultClassNames = getDefaultClassNames();

 /*  const transformDateFormat = (date: Date) => {
    return date.toLocaleDateString("hu-HU", dateFormatOptions);
  }; */
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
      formFields.referees.forEach((refereeItem) => {
        if (refereeItem.clerkUserId) {
          list.push({
            username: refereeItem.username,
            clerkUserId: refereeItem.clerkUserId,
            email: refereeItem.email,
            messageData: formFields,
          });
        }
      });
    }

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
    const validation =
      type === "7s" || type === "UP torna"
        ? validateNonSingleMatch(formFields)
        : validateSingleMatch(formFields);

    if (!validation.isValid) {
      toast.error(validation.error ?? "Ismeretlen hiba a validáció során");
      return;
    }

    if (!selectedMatch?._id) {
      toast.error("Hiányzó mérkőzés azonosító");
      return;
    }

    try {
      const res = await updateMatch(selectedMatch._id, formFields);
      const success = res instanceof Error ? false : res.success;
      if (success) {
        handleEmailSend();
        loadMatches();
        toast.success("Sikeres mentés");
        resetFormFields();
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  return (
    <div className="text-gray-600 overflow-auto max-h-140">
      <form className="flex flex-col overscroll-y-auto">
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 xl:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>Verseny tipus:</Label>
            <Select
              options={types.map((n) => ({
                label: n.name,
                value: n.name,
                name: "type",
              }))}
              placeholder="--Válassz tipust--"
              onChange={(o) => {
                setTypeValue(o);
                setFormFields({
                  ...formFields,
                  type: String(o === undefined ? "" : o?.value),
                });
                if (o?.value === "7s" || o?.value === "UP torna") {
                  setIsSingleMatch(false);
                }
                if (o?.value === "Extra Liga" || o?.value === "NB I") {
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
                    email: "email" in n ? n.email : "",
                    id: "clerkUserId" in n ? n.clerkUserId : "",
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
                        email: o?.email || "",
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
                    email: "email" in n ? n.email : "",
                    id: "clerkUserId" in n ? n.clerkUserId : "",
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
                        email: o?.email || "",
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
                    email: "email" in n ? n.email : "",
                    id: "clerkUserId" in n ? n.clerkUserId : "",
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
                        email: o?.email || "",
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
                    email: "email" in n ? n.email : "",
                    id: "clerkUserId" in n ? n.clerkUserId : "",
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
                        email: i.email || "",
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
                  email: "email" in n ? n.email : "",
                  id: "clerkUserId" in n ? n.clerkUserId : "",
                  name: "referees",
                }))}
                onChange={(o) => {
                  setRefereesValue(o);
                  setFormFields({
                    ...formFields,
                    referees: o.map((i) => ({
                      username: String(i.value), // Ensure username is a string
                      clerkUserId: i.id || "", // Provide a fallback to an empty string
                      email: i.email || "",
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
              <div className="bg-gray-300 self-stretch w-0.5 ml-2.5"></div>
              <div className="flex my-auto items-center text-gray-300 pl-2 pt-0.5">
                <Icon icon="lucide:chevron-down" width="20" height="20" />
              </div>
            </div>
            {calendarOpen && (
              <div className="flex justify-center mx-auto mt-1 mb-6 text-sm font-medium text-gray-700">
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
                    root: `${defaultClassNames.root} border border-gray-200 rounded-xl p-5`,
                    caption_label: `${defaultClassNames.caption_label} text-base font-medium capitalize`,
                    weekday: `${defaultClassNames.weekday} uppercase text-sm`,
                    today: "border border-amber-500",
                    selected:
                      "bg-amber-500  rounded rounded-full text-white bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  }}
                />
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
          <OutlinedButton onClick={closeModal} type={"button"} text={"Mégse"} />
        </div>
      </form>
    </div>
  );
};

export default MatchItemEditModal;
