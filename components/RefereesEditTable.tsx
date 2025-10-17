"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import Skeleton from "@/components/common/Skeleton";
import Input from "@/components/common/InputField";
import { User } from "@/types/types";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { fetchClerkUserList } from "@/lib/actions/fetchClerkUserList";
import { updateProfileStatusAndTitle } from "@/lib/actions/updateProfileStatusAndTitle";

type ClerkUser = {
  id: string;
  publicMetadata: { role: string };
};

export default function RefereesTable() {
  const [selectedReferee, setSelectedReferee] = useState<User | null>(null);
  const [referees, setReferees] = useState<User[]>([]);
  const [authUsers, setAuthUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const loadReferees = async () => {
    setLoading(true);
    const usersData = await fetchUsers();
    const clerkUsers = await fetchClerkUserList();
    setReferees(usersData);
    setAuthUsers(clerkUsers.data);
    setLoading(false);
  };

  const handleSetToEdit = (ref: User) => {
    const user = authUsers.find((user) => user.id === ref.clerkUserId);
    setSelectedReferee(ref);
    setStatus(ref.status);
    setTitle(ref.hasTitle || "");
    setRole(user ? user.publicMetadata.role : "");
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    setSelectedReferee(null);
    setStatus("");
    setTitle("");
    setRole("");
    setIsEditMode(!isEditMode);
  };

  const handleSave = useCallback(async () => {
    try {
      if (!selectedReferee || !role) return;

      if (role !== "admin" && role !== "user") {
        toast.error("A role csak admin vagy user lehet!");
        return;
      }
      if (!title) setTitle("");
      if (title !== "Elnök" && title !== "Főtitkár" && title !== "") {
        toast.error(
          "A titulus csak Elnök és Főtitkár lehet, vagy üresen kell hagyni!"
        );
        return;
      }

      const clerkUserId = selectedReferee.clerkUserId;
      const response = await updateProfileStatusAndTitle(
        clerkUserId,
        status,
        title,
        role
      );
      const success = response instanceof Error ? false : response.success;
      if (success) {
        await loadReferees();
        handleCancel();
      }

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }, [status, title, role]);

  useEffect(() => {
    loadReferees();
  }, []);

  if (loading || !referees || !authUsers)
    return (
      <>
        <Skeleton className="w-full h-18 mb-2" />
        <Skeleton className="w-full h-18 mb-2" />
        <Skeleton className="w-full h-18 mb-2" />
        <Skeleton className="w-full h-18" />
      </>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[880px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-gray-50">
              <TableRow className="text-sm text-center">
                <TableCell
                  isHeader
                  className="px-2 py-4 font-bold text-gray-600 w-[166px]"
                >
                  Név
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-4 font-bold text-gray-600 w-[166px]"
                >
                  Státusz
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-bold text-gray-500 w-[166px]"
                >
                  Titulus
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-bold text-gray-500 w-[166px]"
                >
                  Admin
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-bold text-gray-600 w-[166px]"
                >
                  Szerkesztés
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100">
              {referees.map((ref) => (
                <TableRow
                  key={ref.clerkUserId}
                  className="text-xs text-center h-16"
                >
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {ref.username}
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {isEditMode && selectedReferee?._id === ref._id ? (
                      <Input
                        type="text"
                        name="status"
                        defaultValue={ref.status}
                        onChange={(e) => setStatus(e.target.value)}
                      />
                    ) : (
                      <span>{ref.status}</span>
                    )}
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {isEditMode && selectedReferee?._id === ref._id ? (
                      <Input
                        type="text"
                        name="title"
                        defaultValue={ref.hasTitle}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    ) : (
                      <span>{ref.hasTitle || "-"}</span>
                    )}
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {isEditMode && selectedReferee?._id === ref._id ? (
                      <>
                        {authUsers.map(
                          (user) =>
                            user.id === ref.clerkUserId && (
                              <Input
                                key={ref.clerkUserId}
                                type="text"
                                name="role"
                                defaultValue={user.publicMetadata.role}
                                onChange={(e) => setRole(e.target.value)}
                              />
                            )
                        )}
                      </>
                    ) : (
                      <span>
                        {authUsers.map((user) =>
                          user.id === ref.clerkUserId
                            ? user.publicMetadata.role
                            : ""
                        )}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-gray-500 text-theme-sm text-center">
                    {isEditMode && selectedReferee?._id === ref._id ? (
                      <div className="flex gap-5 justify-center">
                        <button
                          onClick={handleCancel}
                          className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1"
                        >
                          <Icon icon="lucide:circle-x" width="20" height="20" />
                        </button>
                        <button
                          onClick={handleSave}
                          className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1"
                        >
                          <Icon icon="lucide:save" width="20" height="20" />
                        </button>
                      </div>
                    ) : (
                      <>
                        {isEditMode ? (
                          <button
                            disabled
                            className="text-sm font-medium text-center text-gray-400 mx-auto hover:underline py-1 sm:py-1"
                          >
                            <Icon icon="lucide:edit" width="20" height="20" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSetToEdit(ref)}
                            className="text-sm cursor-pointer font-medium text-center text-blue-600 mx-auto hover:underline py-1 sm:py-1"
                          >
                            <Icon icon="lucide:edit" width="20" height="20" />
                          </button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
