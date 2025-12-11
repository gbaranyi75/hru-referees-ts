"use client";
import { useState } from "react";
import MatchListTableEdit from "./MatchListTableEdit";
import { Icon } from "@iconify/react/dist/iconify.js";

const MatchesEdit = () => {
  const [editModeOpen, setEditModeOpen] = useState<boolean>(false);

  const toggleEditMode = () => {
    setEditModeOpen(!editModeOpen);
  };

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
          <MatchListTableEdit />
        </div>
      )}
    </section>
  );
};

export default MatchesEdit;
