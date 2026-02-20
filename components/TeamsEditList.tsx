"use client";

import { useCallback, useState } from "react";
import Skeleton from "./common/Skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/common/DefaultTable";
import { Team } from "@/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import Input from "./common/InputField";
import { updateTeam } from "../lib/actions/teamActions";
import { toast } from "react-toastify";

export default function TeamsEditList({
  teamList,
  loadTeamsAction,
}: {
  teamList: Team[];
  loadTeamsAction: () => void;
}) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [teamLeader, setTeamLeader] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetToEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    setSelectedTeam(null);
    setIsEditMode(!isEditMode);
  };

  const handleSave = useCallback(async () => {
    try {
      if (!teamName && !city && !teamLeader && !phone && !email) return;
      setLoading(true);
      const id = selectedTeam?._id;
      const name = teamName ? teamName : (selectedTeam?.name as string);
      const cityValue = city ? city : (selectedTeam?.city as string);
      const teamLeaderValue = teamLeader
        ? teamLeader
        : (selectedTeam?.teamLeader as string);
      const phoneValue = phone ? phone : (selectedTeam?.phone as string);
      const emailValue = email ? email : (selectedTeam?.email as string);
      const response = await updateTeam(
        id,
        name,
        cityValue,
        teamLeaderValue,
        phoneValue,
        emailValue
      );
      console.log("response", response);
      const success = response instanceof Error ? false : response.success;
      if (success) {
        toast.success("Sikeres mentés");
        loadTeamsAction();
        setIsEditMode(false);
        setSelectedTeam(null);
        setTeamName("");
        setCity("");
        setTeamLeader("");
        setPhone("");
        setEmail("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    teamName,
    city,
    teamLeader,
    phone,
    email,
    selectedTeam,
    loadTeamsAction,
  ]);

  if (loading)
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full h-12 mb-2"
          />
        ))}
      </>
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
                Csapat név
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-41.5">
                Mérkőzések helyszíne
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-41.5">
                Csapatvezető
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-41.5">
                Telefonszám
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-41.5">
                Email
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
            {teamList.map((team) => (
              <TableRow
                key={team._id}
                className="text-xs text-center h-16">
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  {isEditMode && selectedTeam?._id === team._id ? (
                    <Input
                      type="text"
                      name="name"
                      defaultValue={team.name}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  ) : (
                    <span>{team.name}</span>
                  )}
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  {isEditMode && selectedTeam?._id === team._id ? (
                    <Input
                      type="text"
                      name="city"
                      defaultValue={team.city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  ) : (
                    <span>{team.city}</span>
                  )}
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  {isEditMode && selectedTeam?._id === team._id ? (
                    <Input
                      type="text"
                      name="teamLeader"
                      defaultValue={team.teamLeader}
                      onChange={(e) => setTeamLeader(e.target.value)}
                    />
                  ) : (
                    <span>{team.teamLeader}</span>
                  )}
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  {isEditMode && selectedTeam?._id === team._id ? (
                    <Input
                      type="text"
                      name="phone"
                      defaultValue={team.phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  ) : (
                    <span>{team.phone}</span>
                  )}
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  {isEditMode && selectedTeam?._id === team._id ? (
                    <Input
                      type="text"
                      name="email"
                      defaultValue={team.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <span>{team.email}</span>
                  )}
                </TableCell>
                <TableCell className="px-2 py-3 text-gray-500 text-theme-sm text-center">
                  {isEditMode && selectedTeam?._id === team._id ? (
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
                          onClick={() => handleSetToEdit(team)}
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
