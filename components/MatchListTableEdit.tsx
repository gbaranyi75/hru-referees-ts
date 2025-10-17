"use client";
import React, { useEffect, useState } from "react";
import MatchListTableEditModal from "./MatchListTableEditModal";
import { Modal } from "./common/Modal";
import Skeleton from "./common/Skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "./common/Table";
import { Match, User } from "@/types/types";
import { useModal } from "@/hooks/useModal";
import { fetchMatches } from "@/lib/actions/fetchMatches";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function MatchListTable({ referees }: { referees: User[] }) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectedMatch = (match: Match) => {
    setSelectedMatch(match);
    openModal();
  };

  const loadMatches = async () => {
    setLoading(true);
    const fetchedMatches = await fetchMatches();
    let sortedMatches: Match[] = fetchedMatches.sort((a: Match, b: Match) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    setMatches(sortedMatches);
    setLoading(false);
  };

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-12 mb-2 mt-1" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
      </>
    );

  return (
    <>
      <div className="overflow-hidden rounded-xl mt-1 border-1 border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[880px]">
            <Table className="">
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 bg-gray-50">
                <TableRow className="text-xs text-center">
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-800 "
                  >
                    Típus
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-600"
                  >
                    Neme
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-500 "
                  >
                    Kor
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-600 "
                  >
                    Helyszín
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-600 "
                  >
                    Hazai
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-600"
                  >
                    Vendég
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-600 "
                  >
                    Dátum
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-600 "
                  >
                    Időpont
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-bold text-gray-600"
                  >
                    {""}
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100">
                {matches.map((m) => (
                  <TableRow key={m._id} className="text-center text-xs">
                    <TableCell className="px-2 font-bold text-gray-600">
                      {m.type}
                    </TableCell>
                    <TableCell className="px-2 font-normal text-gray-600">
                      {m.gender}
                    </TableCell>
                    <TableCell className="px-2 font-normal text-gray-600">
                      {m.age}
                    </TableCell>
                    <TableCell className="px-2 font-normal text-gray-600">
                      {m.venue}
                    </TableCell>
                    <TableCell className="px-2 text-sm font-semibold text-red-600">
                      {m.home}
                    </TableCell>
                    <TableCell className="px-2 text-sm font-semibold text-green-600">
                      {m.away}
                    </TableCell>
                    <TableCell className="px-2 font-normal text-gray-600">
                      {m.date}
                    </TableCell>
                    <TableCell className="px-2 font-normal text-gray-600">
                      {m.time}
                    </TableCell>
                    <TableCell className="flex px-2 py-3 text-gray-500 text-theme-sm my-auto">
                      <button
                        onClick={() => handleSelectedMatch(m)}
                        className="cursor-pointer text-blue-600 my-auto"
                      >
                        <Icon icon="lucide:edit" width="18" height="18" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={true}
        className="flex flex-col justify-between max-w-[900px] max-h-[700px] px-16 bg-white"
      >
        <div className="py-10">
          <h4 className="font-semibold text-gray-800 mb-10 text-title-sm ">
            Mérkőzés szerkesztése
          </h4>
          <MatchListTableEditModal
            referees={referees}
            closeModal={closeModal}
            selectedMatch={selectedMatch}
            loadMatches={loadMatches}
          />
        </div>
      </Modal>
    </>
  );
}
