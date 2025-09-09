"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MatchListTableEdit from "./MatchListTableEdit";
import { Icon } from "@iconify/react/dist/iconify.js";
import { User } from "@/types/types";
//import { fetchMatches } from "@/lib/actions/fetchMatches";

const MatchesEdit = ({ referees }: { referees: User[] }) => {
  const [isOpen, setIsOpen] = useState(0);
  const router = useRouter();
  const pathName = usePathname();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModeOpen, setEditModeOpen] = useState(false);

  const toggleEditMode = () => {
    setEditModeOpen(!editModeOpen);
    //resetToBase();
  };

  const exitEditMode = () => {
    router.push("/dashboard/matches");
  };

  const toggleOpen = (id: number) => () =>
    setIsOpen((isOpen) => (isOpen === id ? 0 : id));

  const setToEdit = () => setIsEditMode(!isEditMode);

  //if (loading) return <Spinner />;

  return (
    <section>
      <div className="p-5 border border-gray-200 rounded-2xl lg:p-6 text-gray-600">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-lg font-semibold text-gray-600">
            Mérkőzések módosítása
          </h2>
          <button
            onClick={toggleEditMode}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
          >
            <Icon icon="lucide:edit" width="20" height="20" />
            {editModeOpen ? "Mégsem" : "Szerkesztés"}
          </button>
        </div>
      </div>

      {editModeOpen && (
        <div className="rounded-xl overflow-hidden">
          <MatchListTableEdit referees={referees} />
        </div>
      )}
    </section>
  );
};

export default MatchesEdit;
