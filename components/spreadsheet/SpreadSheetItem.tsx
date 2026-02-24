"use client";
import { useState } from "react";
import Image from "next/image";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../common/Modal";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/common/DefaultTable";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import checkedImage from "@/public/images/checked.png";
import unCheckedImage from "@/public/images/unchecked.png";
import { UserSelection, Calendar } from "@/types/types";
import OutlinedButton from "../common/OutlinedButton";

const SpreadSheetItem = ({
  calendar,
  isTableOpen,
  toggle,
  initialSelections,
}: {
  calendar: Calendar | undefined;
  isTableOpen: boolean;
  toggle: () => void;
  initialSelections: UserSelection[];
}) => {
  const [currentDates] = useState(calendar?.days);
  const [availableUsers, setAvailableUsers] = useState<UserSelection[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleOpenSpreadSheet = () => {
    toggle();
  };

  const handleOpenModal = (date: string) => {
    const available: UserSelection[] = [];
    initialSelections.forEach((selection) => {
      if (selection.selectedDays.includes(date)) {
        available.push(selection);
      }
    });
    setAvailableUsers(available);
    setSelectedDate(date);
    openModal();
  };

  const handleCloseModal = () => {
    setAvailableUsers([]);
    closeModal();
  };

  return (
    <>
      <div className="flex flex-col border overflow-hidden rounded-xl border-gray-200 bg-white text-gray-600 text-center justify-center z-0">
        <div
          className={`flex md:px-6 py-6 items-center justify-between ${isTableOpen ? "bg-gray-100" : "bg-white"}`}>
          <span className="ml-6">
            <h2 className="text-lg mr-1 font-semibold">{calendar?.name}</h2>
          </span>
          <span
            className="my-auto mr-6 p-2 rounded-full bg-gray-200 cursor-pointer"
            onClick={handleOpenSpreadSheet}>
            {!isTableOpen ? (
              <MdOutlineExpandMore size={24} />
            ) : (
              <MdOutlineExpandLess size={24} />
            )}
          </span>
        </div>
        {isTableOpen && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white m-5">
            <div className="overflow-x-auto">
              <Table className="w-full table-auto text-center text-gray-500 mx-auto">
                <TableHeader className="border-b border-gray-100 bg-gray-50">
                  <TableRow className="text-sm text-center">
                    <TableCell
                      isHeader
                      className="py-4 px-6 text-center min-w-25">
                      Név
                    </TableCell>
                    {currentDates?.map((date) => (
                      <TableCell
                        isHeader
                        className="py-4 px-2 text-center"
                        key={date}>
                        <a
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={date}
                          className="cursor-pointer"
                          onClick={() => handleOpenModal(date)}>
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
                  {initialSelections.map((userSelection, idx) => (
                    <TableRow key={idx} className="bg-white">
                      <TableCell className="px-1 md:px-3 py-3 text-center">
                        {userSelection.username}
                      </TableCell>
                      {currentDates?.map((date) => (
                        <TableCell key={date} className="px-1 py-3 text-center">
                          <div className="flex justify-center">
                            {userSelection.selectedDays.includes(date) ? (
                              <Image
                                className="h-5 w-5"
                                src={checkedImage}
                                alt="checked"
                                width={10}
                                height={10}
                                priority
                              />
                            ) : (
                              <Image
                                className="h-5 w-5"
                                src={unCheckedImage}
                                alt="unchecked"
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
        )}
      </div>
      <Modal
        isOpen={isOpen}
        showCloseButton={false}
        onClose={handleCloseModal}
        className="w-full md:max-w-150 m-8">
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
            <OutlinedButton onClick={handleCloseModal} text="Bezárás" />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default SpreadSheetItem;
