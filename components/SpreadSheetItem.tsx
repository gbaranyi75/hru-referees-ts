"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useModal } from "../hooks/useModal";
import { Modal } from "./common/Modal";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./common/Table";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { fetchUserSelections } from "@/lib/actions/fetchUserSelections";
import checkedImage from "@/assets/images/checked.png";
import unCheckedImage from "@/assets/images/unchecked.png";
import { UserSelection, Calendar, User } from "@/types/types";
import Skeleton from "./common/Skeleton";
import OutlinedButton from "./common/OutlinedButton";

const SpreadSheetItem = ({
  calendar,
  isTableOpen,
  toggle,
  users,
}: {
  calendar: Calendar | undefined;
  isTableOpen: boolean;
  toggle: () => void;
  users: User[];
}) => {
  const [currentDates] = useState(calendar?.days);
  const [userSelections, setUserSelection] = useState<UserSelection[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserSelection[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleOpenSpreadSheet = () => {
    toggle();
  };

  const fetchCurrentSelection = async () => {
    let selectionsWithCorrectUserName: UserSelection[] = [];
    const selections = await fetchUserSelections(calendar?._id);
    selections.map((selection: UserSelection) => {
      users.map((user) => {
        if (selection.clerkUserId === user.clerkUserId) {
          selectionsWithCorrectUserName.push({
            ...selection,
            username: user.username,
          });
        }
      });
    });
    setUserSelection(selectionsWithCorrectUserName);
  };

  useEffect(() => {
    fetchCurrentSelection();
  }, []);

  const handleOpenModal = (date: string) => {
    userSelections.forEach((selection) => {
      if (selection.selectedDays.includes(date)) {
        setAvailableUsers((prev) => [...prev, selection]);
        setSelectedDate(date);
      }
    });
    openModal();
  };

  const handleClosModal = () => {
    setAvailableUsers([]);
    closeModal();
  };

  if (!userSelections)
    return (
      <>
        <Skeleton className="w-full h-14 mb-2" />
        <Skeleton className="w-full h-8 mb-2" />
        <Skeleton className="w-full h-8 mb-2" />
        <Skeleton className="w-full h-8 mb-4" />
      </>
    );

  return (
    <>
      <div className="flex flex-col border overflow-hidden rounded-xl border-gray-200 bg-white text-gray-600 text-center justify-center z-0">
        <div
          className={`flex md:px-6 py-6 items-center justify-between ${isTableOpen ? "bg-gray-100" : "bg-white"}`}
        >
          <span className="ml-6">
            <h2 className="text-lg mr-1 font-semibold">{calendar?.name}</h2>
          </span>
          <span
            className="my-auto mr-6 p-2 rounded-full bg-gray-200 cursor-pointer"
            onClick={handleOpenSpreadSheet}
          >
            {!isTableOpen ? (
              <MdOutlineExpandMore size={24} />
            ) : (
              <MdOutlineExpandLess size={24} />
            )}
          </span>
        </div>
        {isTableOpen && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white m-5">
            <div className="col-span-12 md:justify-center overflow-x-auto z-1">
              <div className="min-w-[760px]">
                <Table className="max-w-5xl text-center text-gray-500 mx-auto">
                  <TableHeader className="border-b border-gray-100 bg-gray-50">
                    <TableRow className="text-xs text-center">
                      <TableCell isHeader className="py-4 px-6 text-center">
                        Név
                      </TableCell>
                      {currentDates?.map((date) => (
                        <TableCell
                          isHeader
                          className="py-4 px-2 text-center"
                          key={date}
                        >
                          <a
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={date}
                            //data-tooltip-content={`Kattints, hogy lásd az` <br /> `elérhető játékvezetőket ${date} napon!`}
                            className="cursor-pointer"
                            onClick={() => handleOpenModal(date)}
                          >
                            {date}
                          </a>
                          <Tooltip
                            id="my-tooltip"
                            place="top"
                            border="1px solid #cdd4df"
                            style={{
                              borderRadius: "8px",
                              fontSize: "12px",
                              backgroundColor: "#f1f3f6",
                              color: "#7e8591",
                            }}
                            render={({ content }) => (
                              <span className="text-center">
                                Kattints, hogy lásd az elérhető
                                <br />
                                játékvezetőket {content} napon!
                              </span>
                            )}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 text-sm">
                    {userSelections.map((user, idx) => (
                      <TableRow key={idx} className="bg-white ">
                        {users.map((dbUser, idx) =>
                          dbUser.clerkUserId === user.clerkUserId ? (
                            <TableCell
                              key={idx}
                              className="px-1 md:px-3 py-3 text-center"
                            >
                              {dbUser.username}
                            </TableCell>
                          ) : null
                        )}
                        {currentDates?.map((date) => (
                          <TableCell
                            key={date}
                            className="px-1 py-3 text-center"
                          >
                            <div className="flex justify-center">
                              {user.selectedDays.includes(date) ? (
                                <Image
                                  className="h-5 w-5"
                                  src={checkedImage}
                                  alt="logo"
                                  width={10}
                                  height={10}
                                  priority
                                />
                              ) : (
                                <Image
                                  className="h-5 w-5"
                                  src={unCheckedImage}
                                  alt="logo"
                                  width={10}
                                  height={10}
                                  priority
                                />
                              )}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        showCloseButton={false}
        onClose={handleClosModal}
        className="w-full md:max-w-[600px] m-8"
      >
        <div className="no-scrollbar relative overflow-y-auto rounded-3xl bg-white py-8 px-4">
          <div className="px-4 pt-3">
            <div className="flex justify-center">
              <h4 className="text-xl font-semibold text-gray-600 ">
                {selectedDate} napon {availableUsers.length} játékvezető érhető
                el.
              </h4>
            </div>
            <ul className="pt-6 px-6">
              {availableUsers.map((ref) => (
                <li key={ref.clerkUserId}>
                  <p className="py-1 text-md text-gray-500">
                    {" "}
                    - {ref.username}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center pt-6">
            <OutlinedButton onClick={handleClosModal} text="Bezárás" />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default SpreadSheetItem;
