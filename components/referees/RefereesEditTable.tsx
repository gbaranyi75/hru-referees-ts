"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../common/DefaultTable";
import Skeleton from "../common/Skeleton";
import Input from "../common/InputField";
import { GuestUser, User, ClerkUser } from "@/types/models";
import { updateProfileStatusAndTitle } from "@/lib/actions/updateProfileStatusAndTitle";
import { useUsers } from "@/contexts/UsersContext";
import { useClerkUsers } from "@/contexts/ClerkUsersContext";
import { useGuestUsers } from "@/contexts/GuestUsersContext";

export default function RefereesTable() {
  const { users, loading, error, refreshUsers } = useUsers();
  const {
    guestUsers,
    loading: guestLoading,
    error: guestError,
    refreshGuestUsers,
  } = useGuestUsers();
  const {
    clerkUsers,
    loading: clerkLoading,
    error: clerkError,
    refreshClerkUsers,
  } = useClerkUsers();

  const [selectedReferee, setSelectedReferee] = useState<
    User | GuestUser | null
  >(null);
  const [referees, setReferees] = useState<User[]>(users || []);
  const [guestReferees, setGuestReferees] = useState<GuestUser[]>(
    guestUsers || [],
  );
  const [authUsers, setAuthUsers] = useState<ClerkUser[]>(clerkUsers || []);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const handleSetToEdit = (ref: User | GuestUser) => {
    const user =
      "clerkUserId" in ref
        ? authUsers.find((user) => user.id === ref.clerkUserId)
        : null;
    setSelectedReferee(ref);
    setStatus(ref.status);
    setTitle("hasTitle" in ref ? ref.hasTitle : "");
    setRole(
      user &&
        user.publicMetadata &&
        typeof user.publicMetadata === "object" &&
        "role" in user.publicMetadata
        ? String(user.publicMetadata.role)
        : "",
    );
    setIsEditMode(!isEditMode);
  };

  const handleCancel = useCallback(() => {
    setSelectedReferee(null);
    setStatus("");
    setTitle("");
    setRole("");
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

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
          "A titulus csak Elnök és Főtitkár lehet, vagy üresen kell hagyni!",
        );
        return;
      }

      const clerkUserId =
        "clerkUserId" in selectedReferee ? selectedReferee.clerkUserId : "";
      const response = await updateProfileStatusAndTitle(
        clerkUserId,
        status,
        title,
        role,
      );
      const success = response instanceof Error ? false : response.success;
      if (success) {
        await refreshUsers();
        await refreshGuestUsers();
        await refreshClerkUsers();
        handleCancel();
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    status,
    title,
    role,
    handleCancel,
    selectedReferee,
    refreshUsers,
    refreshGuestUsers,
    refreshClerkUsers,
  ]);

  useEffect(() => {
    setReferees(users || []);
    setGuestReferees(guestUsers || []);
    setAuthUsers(clerkUsers || []);
  }, [users, guestUsers, clerkUsers]);

  if (loading || !referees || !authUsers || clerkLoading || guestLoading)
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full h-18 mb-2"
          />
        ))}
      </>
    );

  if (error || guestError || clerkError)
    return (
      <div className="text-red-500">Hiba történt az adatok betöltésekor.</div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <Table className="w-full table-auto">
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 bg-gray-50">
            <TableRow className="text-sm text-center">
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-41.5">
                Név
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-41.5">
                Státusz
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-4 font-bold text-gray-500 w-41.5">
                Titulus
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-4 font-bold text-gray-500 w-41.5">
                Szerepkör
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-4 font-bold text-gray-600 w-41.5">
                Szerkesztés
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100">
            {referees.map((ref) => (
              <TableRow
                key={ref.clerkUserId}
                className="text-xs text-center h-16">
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
                              defaultValue={String(
                                user.publicMetadata?.role ?? "",
                              )}
                              onChange={(e) => setRole(e.target.value)}
                            />
                          ),
                      )}
                    </>
                  ) : (
                    <span>
                      {authUsers.map((user) =>
                        user.id === ref.clerkUserId
                          ? String(user.publicMetadata?.role ?? "")
                          : "",
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-2 py-3 text-gray-500 text-theme-sm text-center">
                  {isEditMode && selectedReferee?._id === ref._id ? (
                    <div className="flex gap-5 justify-center">
                      <button
                        onClick={handleCancel}
                        className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1">
                        <Icon
                          icon="lucide:circle-x"
                          width="20"
                          height="20"
                        />
                      </button>
                      <button
                        onClick={handleSave}
                        className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1">
                        <Icon
                          icon="lucide:save"
                          width="20"
                          height="20"
                        />
                      </button>
                    </div>
                  ) : (
                    <>
                      {isEditMode ? (
                        <button
                          disabled
                          className="text-sm font-medium text-center text-gray-400 mx-auto hover:underline py-1 sm:py-1">
                          <Icon
                            icon="lucide:edit"
                            width="20"
                            height="20"
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetToEdit(ref)}
                          className="text-sm cursor-pointer font-medium text-center text-blue-600 mx-auto hover:underline py-1 sm:py-1">
                          <Icon
                            icon="lucide:edit"
                            width="20"
                            height="20"
                          />
                        </button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {guestReferees.map((ref) => (
              <TableRow
                key={ref._id}
                className="text-xs text-center h-16">
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
                  <span>{"-"}</span>
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  <span>vendég jv</span>
                </TableCell>
                <TableCell className="px-2 py-3 text-gray-500 text-theme-sm text-center">
                  {isEditMode && selectedReferee?._id === ref._id ? (
                    <div className="flex gap-5 justify-center">
                      <button
                        onClick={handleCancel}
                        className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1">
                        <Icon
                          icon="lucide:circle-x"
                          width="20"
                          height="20"
                        />
                      </button>
                      <button
                        onClick={handleSave}
                        className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1">
                        <Icon
                          icon="lucide:save"
                          width="20"
                          height="20"
                        />
                      </button>
                    </div>
                  ) : (
                    <>
                      {isEditMode ? (
                        <button
                          disabled
                          className="text-sm font-medium text-center text-gray-400 mx-auto hover:underline py-1 sm:py-1">
                          <Icon
                            icon="lucide:edit"
                            width="20"
                            height="20"
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetToEdit(ref)}
                          className="text-sm cursor-pointer font-medium text-center text-blue-600 mx-auto hover:underline py-1 sm:py-1">
                          <Icon
                            icon="lucide:edit"
                            width="20"
                            height="20"
                          />
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
  );
}
