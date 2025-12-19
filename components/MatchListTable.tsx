"use client";

import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Modal } from "@/components/common/Modal";
import Skeleton from "@/components/common/Skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/common/DefaultTable";
import { MatchListTableModal } from "./MatchListTableModal";
import Pagination from "./Pagination";
import { Match } from "@/types/types";
import { useModal } from "@/hooks/useModal";
import {
  fetchMatches,
  fetchMatchesCount,
  fetchMatchById,
} from "@/lib/actions/fetchMatches";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";

const ITEMS_PER_PAGE = 12;

const MatchList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(
    searchParams.get("page") ? +searchParams.get("page")! : 1
  );
  // Track which matchId from URL has been processed to avoid repeated opens
  const processedMatchIdRef = useRef<string | null>(null);

  const handleSelectedMatch = (match: Match) => {
    setSelectedMatch(match);
    openModal();
    // Add matchId to URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("matchId", match._id as string);
    router.replace(`${pathName}?${params}` as Route);
  };

  const handleCloseModal = () => {
    setSelectedMatch(null);
    closeModal();
    // Reset processed matchId so the same match can be opened again from URL
    processedMatchIdRef.current = null;
    // Remove matchId from URL but keep page
    const params = new URLSearchParams(searchParams.toString());
    params.delete("matchId");
    router.replace(`${pathName}?${params}` as Route);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    setPage(newPage);
    router.replace(`${pathName}?${params}` as Route);
  };

  const loadCount = async () => {
    const countData = await fetchMatchesCount();
    if (typeof countData === "number") {
      setCount(countData);
    }
  };

  useEffect(() => {
    const loadMatches = async () => {
      const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
      if (count > 0 && (page <= 0 || page > totalPages)) {
        setPage(1);
        const params = new URLSearchParams(window.location.search);
        params.set("page", "1");
        router.replace(`${pathName}?${params}` as Route);
      }
      const result = await fetchMatches({
        limit: ITEMS_PER_PAGE,
        skip: page <= 0 || page > totalPages ? 0 : (page - 1) * ITEMS_PER_PAGE,
      });
      if (result.success) {
        setMatches(result.data);
      }
      setLoading(false);
    };

    loadMatches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, count, pathName]);

  useEffect(() => {
    loadCount();
  }, []);

  // Open modal if matchId is in URL
  useEffect(() => {
    const matchId = searchParams.get("matchId");
    
    // Skip if no matchId or already processed this matchId
    if (!matchId || processedMatchIdRef.current === matchId) return;
    
    // Skip if still loading
    if (loading) return;

    // First try to find the match in the current page
    const matchInCurrentPage = matches.find((m) => m._id === matchId);
    if (matchInCurrentPage) {
      processedMatchIdRef.current = matchId;
      setSelectedMatch(matchInCurrentPage);
      openModal();
      return;
    }

    // If not found in current page, fetch directly from server
    const fetchMatchDirectly = async () => {
      const result = await fetchMatchById(matchId);
      if (result.success && result.data) {
        processedMatchIdRef.current = matchId;
        setSelectedMatch(result.data);
        openModal();
      }
    };

    fetchMatchDirectly();
  }, [searchParams, loading, matches, openModal]);

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
    <>
      <div className="overflow-hidden rounded-xl mt-1 border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full table-auto">
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-gray-50">
              <TableRow className="text-sm text-center">
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-800 ">
                  Típus
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-600">
                  Neme
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-500 ">
                  Kor
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-600 ">
                  Helyszín
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-600 ">
                  Hazai
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-600">
                  Vendég
                </TableCell>

                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-600 ">
                  Dátum
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-600 ">
                  Időpont
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-bold text-gray-600">
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100">
              {matches.map((m) => (
                <TableRow
                  key={m._id}
                  className="text-center text-sm">
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
                      className="cursor-pointer text-blue-600 my-auto">
                      <Icon
                        icon="lucide:eye"
                        width="20"
                        height="20"
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          itemsCount={count}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={page}
          changePage={handlePageChange}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        showCloseButton={true}
        className="max-w-125 p-5 lg:p-10">
        <MatchListTableModal
          selectedMatch={selectedMatch}
          closeModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default MatchList;
