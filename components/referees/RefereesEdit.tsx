"use client";
import { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import Input from "../common/InputField";
import DisabledButton from "../common/DisabledButton";
import Label from "../common/Label";
import OutlinedButton from "../common/OutlinedButton";
import PrimaryButton from "../common/PrimaryButton";
import Checkbox from "../common/Checkbox";
import RefereesEditTable from "./RefereesEditTable";
import { createGuestUser } from "@/lib/actions/createGuestUser";
import { fetchGuestUsers } from "@/lib/actions/fetchGuestUser";
import { Address } from "@/types/models";

const RefereesEdit = () => {
  const [editModeOpen, setEditModeOpen] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [address, setAddress] = useState<Address>({ country: "" }); // Initialize with an empty Address object
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [keyValue, setKeyValue] = useState<number>(0);
  const toggleEditMode = () => {
    setEditModeOpen((prev) => !prev);
    resetToDefault();
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setEdited(true);
    }
    setUserName(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setEdited(true);
    }
    setStatus(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setEdited(true);
    }
    setAddress((prevAddress) => ({
      ...prevAddress,
      country: e.target.value,
    }));
  };

  const resetToDefault = useCallback(() => {
    setEdited(false);
    setUserName("");
    setStatus("");
    setAddress({ country: "" });
  }, []);

  const toggleCreateNew = useCallback(() => {
    setEditModeOpen((prev) => !prev);
    resetToDefault();
  }, [resetToDefault]);

  const handleSave = useCallback(async () => {
    try {
      if (
        userName === "" ||
        address.country === "" ||
        isGuest === false ||
        status === ""
      ) {
        toast.error("Kérlek, tölts ki minden kötelező mezőt");
        return;
      }
      const result = await createGuestUser({ userName, address, status, isGuest });
      if (result.success) {
        toast.success("Sikeres mentés");
        resetToDefault();
        toggleCreateNew();
        fetchGuestUsers()
        setKeyValue((prev) => prev + 1);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Hiba történt a mentés során");
    }
  }, [userName, address, isGuest, status, resetToDefault, toggleCreateNew]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
      <div className="flex flex-col mb-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
          <button
            onClick={toggleEditMode}
            className="flex w-full items-center justify-center gap-2 rounded-full border mb-4 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
          >
            <Icon icon="lucide:plus" width="20" height="20" />
            {editModeOpen ? "Mégsem" : "Új vendég játékvezető hozzáadása"}
          </button>
        </div>
        {editModeOpen && (
          <>
            <div className="grid grid-cols-1 gap-x-10 gap-y-5 xl:grid-cols-2">
              
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="username">Név:</Label>
                <Input
                  type="text"
                  id="username"
                  defaultValue={""}
                  onChange={handleUserNameChange}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="address">Ország:</Label>
                <Input
                  type="text"
                  id="address"
                  defaultValue={""}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="status">Státusz:</Label>
                <Input
                  type="text"
                  id="status"
                  defaultValue={""}
                  onChange={handleStatusChange}
                />
              </div>
              <div className="col-span-1 lg:col-span-1">
                <Label htmlFor="status">Vendég játékvezető:</Label>
                <Checkbox checked={isGuest} onChange={setIsGuest} />
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 justify-center lg:justify-end">
              <div className="px-4 py-3 text-center sm:px-6">
                <OutlinedButton
                  text={"Mégse"}
                  type={"button"}
                  onClick={toggleCreateNew}
                />
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                {edited ? (
                  <PrimaryButton onClick={handleSave} text="Mentés" />
                ) : (
                  <DisabledButton text={"Mentés"} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <RefereesEditTable key={keyValue}/>
    </div>
  );
};
export default RefereesEdit;
