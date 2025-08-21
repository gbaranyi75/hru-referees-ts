"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Calendar from "react-calendar";
import { toast } from "react-toastify";
import {
  teams,
  types,
  genderOptions,
  ages,
  venues,
  hours,
} from "@/constants/matchData";
import OutlinedButton from "./common/OutlinedButton";
import PrimaryButton from "./common/PrimaryButton";
import DisabledButton from "./common/DisabledButton";
import {createMatch} from "@/lib/actions/createMatch";
import Spinner from "./common/Spinner";
import { User } from "@/types/types";

const defaultFormFields = {
  home: "",
  away: "",
  type: "",
  gender: "",
  age: "",
  venue: "",
  referee: {},
  referees: [],
  assist1: {},
  assist2: {},
  controllers: [],
  date: "",
  time: "",
};

const MatchesNew = ({ users }: {users: User[]}) => {

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [refList, setRefList] = useState([]);
  const [edited, setEdited] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedType, setSelectedType] = useState();
  const [isSingleMatch, setIsSingleMatch] = useState(true);
  const [refereesList, setRefereesList] = useState(null);
  const [controllersList, setControllersList] = useState(null);
  const [refArray, setRefArray] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [hoursArr, setHoursArr] = useState();
  const {
    home,
    away,
    type,
    gender,
    age,
    venue,
    referee,
    assist1,
    assist2,
    controllers,
    date,
    time,
  } = formFields;

  const router = useRouter();

  const handleCalendarOpen = (e) => {
    e.preventDefault();
    setShowCalendar((state) => !state);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // test type
    if (type === "7s" || type === "UP torna") {
      if (date !== "" && time !== "" && venue !== "") {
        try {
          await createMatch(formFields);
          resetFormFields();
          //resetEditMode();
          router.push("/dashboard/matches");
        } catch (error) {
          console.error(error.message);
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
        (referee !== "" && assist1 !== "" && referee === assist1) ||
        (referee !== "" && assist2 !== "" && referee === assist2) ||
        (assist2 !== "" && assist1 !== "" && assist2 === assist1)
      ) {
        toast.error("A nevek nem egyezhetnek meg");
        return;
      }
      if (
        controllers.includes(referee) ||
        controllers.includes(assist1) ||
        controllers.includes(assist2)
      ) {
        toast.error("A nevek nem egyezhetnek meg");
        return;
      }
      if (
        home !== "" &&
        away !== "" &&
        date !== "" &&
        time !== "" &&
        venue !== ""
      ) {
        try {
          await createMatch(formFields);
          router.push("/dashboard/matches");
          //resetFormFields();
          //resetEditMode();
        } catch (error) {
          console.error(error.message);
        }
      } else {
        toast.error("Kérlek, tölts ki minden kötelező mezőt");
      }
    }
  };

  const exitEditMode = () => {
    router.push("/dashboard/matches");
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleDateChange = () => {
    setFormFields({ ...formFields, date: selectedDate });
  };

  const handleChange = (data) => {
    if (data.name === "type") setSelectedType(data.value);
    setFormFields({ ...formFields, [data.name]: data.value });
    setEdited(true);
  };

  const handleRefChange = (data) => {
    const refObject = {
      userName: data.value,
      userId: data.id,
    };
    if (data.name === "referee") {
      setFormFields({
        ...formFields,
        referee: refObject,
      });
    } else if (data.name === "assist1") {
      setFormFields({
        ...formFields,
        assist1: refObject,
      });
    } else if (data.name === "assist2") {
      setFormFields({
        ...formFields,
        assist2: refObject,
      });
    }
  };

  const handleSelectRefs = (data) => {
    setRefereesList(data);
    let refs = [];
    data.map((ref) => {
      return refs.push({ userName: ref.value, userId: ref.id });
    });
    setFormFields({ ...formFields, referees: refs });
  };

  const handleSelectControllers = (data) => {
    console.log(data);
    setControllersList(data);
    let refs = [];
    data.map((ref) => {
      return refs.push({ userName: ref.value, userId: ref.id });
    });
    setFormFields({ ...formFields, controllers: refs });
  };

  const createRefArray = () => {
    setRefArray(
      refList.map((ref) => ({
        label: ref.displayName,
        value: ref.displayName,
        id: ref._id,
      }))
    );
  };

  const createHoursArray = () => {
    let hoursList = [];
    hours.map((hour) => hoursList.push({ name: hour }));
    setHoursArr(hoursList);
  };

  useEffect(() => {
    handleDateChange();
  }, [selectedDate]);

  useEffect(() => {
    if (formFields.type === "7s" || formFields.type === "UP torna") {
      setIsSingleMatch(false);
      createRefArray();
    } else {
      setIsSingleMatch(true);
      createRefArray();
    }
  }, [selectedType]);

  useEffect(() => {
    setRefList((prev) => users);
    setRefArray(
      users.map((ref) => ({
        label: ref.username,
        value: ref.username,
        id: ref._id,
      }))
    );
    createHoursArray();
  }, [users]);

  if (!users) return <Spinner />;

  return (
    <div className="mt-5  mb-6 lg:mx-16 md:mt-0 bg-white md:text-left">
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="md:grid grid-cols-2 gap-6">
              <div className="mb-6 md:mb-0">
                <div className="block text-sm font-medium text-gray-700">
                  Típus:
                </div>
                <Select
                  className="mt-1 text-sm text-gray-700"
                  placeholder="--Válassz típust--"
                  onChange={handleChange}
                  options={types.map((n) => ({
                    label: n.name,
                    value: n.name,
                    name: "type",
                  }))}
                />
              </div>
              {isSingleMatch && (
                <>
                  <div className="mb-6 md:mb-0">
                    <label
                      htmlFor="home"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Hazai:
                    </label>
                    <Select
                      className="mt-1 text-sm text-gray-700"
                      placeholder="--Válassz egyesületet--"
                      onChange={handleChange}
                      options={teams.map((n) => ({
                        label: n.name,
                        value: n.name,
                        name: "home",
                      }))}
                    />
                  </div>

                  <div className="mb-6 md:mb-0">
                    <label
                      htmlFor="away"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vendég:
                    </label>
                    <Select
                      className="mt-1 text-sm text-gray-700"
                      placeholder="--Válassz egyesületet--"
                      onChange={handleChange}
                      options={teams.map((n) => ({
                        label: n.name,
                        value: n.name,
                        name: "away",
                      }))}
                    />
                  </div>
                </>
              )}
              <div className="mb-6 md:mb-0">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Neme:
                </label>
                <Select
                  className="mt-1 text-sm text-gray-700"
                  placeholder="--Válassz nemet--"
                  onChange={handleChange}
                  options={genderOptions.map((n) => ({
                    label: n.name,
                    value: n.name,
                    name: "gender",
                  }))}
                />
              </div>
              <div className="mb-6 md:mb-0">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Korosztály:
                </label>
                <Select
                  className="mt-1 text-sm text-gray-700"
                  placeholder="--Válassz korosztályt--"
                  onChange={handleChange}
                  options={ages.map((n) => ({
                    label: n.name,
                    value: n.name,
                    name: "age",
                  }))}
                />
              </div>
              <div className="mb-6 md:mb-0">
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Helyszín:
                </label>
                <Select
                  className="mt-1 text-sm text-gray-700"
                  placeholder="--Válassz helyszínt--"
                  onChange={handleChange}
                  options={venues.map((n) => ({
                    label: n.name,
                    value: n.name,
                    name: "venue",
                  }))}
                />
              </div>
              {isSingleMatch && (
                <>
                  <div className="mb-6 md:mb-0">
                    <label
                      htmlFor="referee"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Játékvezető:
                    </label>
                    <Select
                      className="mt-1 text-sm text-gray-700"
                      placeholder="--Válassz a listából--"
                      onChange={handleRefChange}
                      options={users.map((ref) => ({
                        label: ref.username,
                        value: ref.username,
                        id: ref._id,
                        name: "referee",
                      }))}
                    />
                  </div>
                  <div className="mb-6 md:mb-0">
                    <label
                      htmlFor="assist1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Asszisztens 1:
                    </label>
                    <Select
                      className="mt-1 text-sm text-gray-700"
                      placeholder="--Válassz a listából--"
                      onChange={handleRefChange}
                      options={users.map((ref) => ({
                        label: ref.username,
                        value: ref.username,
                        id: ref._id,
                        name: "assist1",
                      }))}
                    />
                  </div>
                  <div className="mb-6 md:mb-0">
                    <label
                      htmlFor="assist2"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Asszisztens 2:
                    </label>
                    <Select
                      className="mt-1 text-sm text-gray-700"
                      placeholder="--Válassz a listából--"
                      onChange={handleRefChange}
                      options={users.map((ref) => ({
                        label: ref.username,
                        value: ref.username,
                        id: ref._id,
                        name: "assist2",
                      }))}
                    />
                  </div>

                  <div className="mb-6 md:mb-0">
                    <div className="block text-sm font-medium text-gray-700">
                      Ellenőr(ök):
                    </div>
                    <Select
                      value={controllersList}
                      className="mt-1 text-sm text-gray-700"
                      placeholder="--Válassz a listából--"
                      isMulti
                      onChange={handleSelectControllers}
                      options={refArray}
                    />
                  </div>
                </>
              )}

              <div
                className={
                  !isSingleMatch
                    ? "md:w-1/2 col-span-2 text-center mx-auto mb-6 md:mb-0"
                    : "flex flex-col justify-center mb-6 md:mb-0"
                }
              >
                <label className="block text-sm font-medium text-gray-700">
                  Dátum kiválasztása:
                </label>
                <input
                  type="text"
                  name="eventName"
                  placeholder="---Válassz dátumot---"
                  value={selectedDate}
                  id="eventName"
                  autoComplete="eventName"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 text-center mb-6 md:mb-0">
                <div className="mb-4">
                  <OutlinedButton
                    text={"Mutasd a naptárt"}
                    onClick={handleCalendarOpen}
                  />
                </div>
                {showCalendar && (
                  <Calendar
                    onChange={(date) => {
                      setSelectedDate(
                        new Date(date).toISOString().slice(0, 10)
                      );
                      //setEdited(true);
                    }}
                    value={date}
                    onClickDay={() => setShowCalendar(false)}
                  />
                )}
              </div>
              <div
                className={
                  isSingleMatch ? "w-1/2 col-span-2 mx-auto" : "mb-6 md:mb-0"
                }
              >
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Időpont:
                </label>
                <Select
                  className="mt-1 text-sm text-gray-700"
                  placeholder="--Válassz a listából--"
                  //isMulti
                  onChange={handleChange}
                  options={hoursArr.map((n) => ({
                    label: n.name,
                    value: n.name,
                    name: "time",
                  }))}
                />
              </div>
              {!isSingleMatch && (
                <div>
                  <div className="block text-sm font-medium text-gray-700">
                    Játékvezetők:
                  </div>
                  <Select
                    value={refereesList}
                    className="mt-1 text-sm text-gray-700"
                    placeholder="--Válassz játékvezetőt--"
                    isMulti
                    onChange={handleSelectRefs}
                    options={refArray}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 md:mt-10 px-4 py-3 text-center sm:px-6">
            {edited ? (
              <PrimaryButton type={"submit"} text={"Mentem a módosításokat"} />
            ) : (
              <DisabledButton text={"Mentem a módosításokat"} />
            )}
          </div>
          <div className="mb-5 md:mb-10 px-4 py-3 text-center sm:px-6">
            <OutlinedButton
              onClick={exitEditMode}
              type={"button"}
              text={"Mégse"}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MatchesNew;
