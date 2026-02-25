"use client";

import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { Modal } from "@/components/common/Modal";
import Skeleton from "@/components/common/Skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/common/DefaultTable";
import MatchListTableModal from "./MatchListTableModal";
import { smoothScrollTo } from "@/lib/utils/scrollUtils";
import { Match } from "@/types/models";
import { useModal } from "@/hooks/useModal";
import {
  fetchMatchesCount,
  fetchMatchById,
} from "@/lib/actions/matchActions";
import { useMatches } from "@/hooks/useMatches";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";


const LOAD_COUNT = 12;

const MatchListTable = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [count, setCount] = useState<number>(0);
  const [isCountLoading, setIsCountLoading] = useState<boolean>(false);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [skip, setSkip] = useState(0);
  // Dátum filter a tab alapján
  // Track which matchId from URL has been processed to avoid repeated opens
  const processedMatchIdRef = useRef<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);
  // Smooth scroll a lista aljára load more után
  const handleLoadMore = () => {
    shouldScrollRef.current = true;
    setSkip((prev) => prev + LOAD_COUNT);
  };

  // useMatches hook: skip/limit alapú lapozás
  const { data: matches = [], isLoading: loading, isFetching } = useMatches({
    limit: LOAD_COUNT,
    skip,
    sortOrder: 'asc',
    dateFilter: activeTab, // 'upcoming' vagy 'past'
  });
  // Tab váltáskor reseteljük a skip-et és az allMatches-t
  useEffect(() => {
    setSkip(0);
    setAllMatches([]);
  }, [activeTab]);
  // Új adag betöltésekor hozzáfűzzük az allMatches-hez
  useEffect(() => {
    if (matches.length > 0) {
      setAllMatches((prev) => skip === 0 ? matches : [...prev, ...matches]);
    }
  }, [matches, skip]);

  useEffect(() => {
    if (!shouldScrollRef.current) return;
    shouldScrollRef.current = false;
    requestAnimationFrame(() => {
      if (loadMoreRef.current) {
        smoothScrollTo(loadMoreRef.current, 1200);
      }
    });
  }, [allMatches]);

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

  // Megnézi, hogy a kapott dátum a mai nap és a következő 7 nap között van-e (beleértve a mai napot is)
  const isWithinNext7Days = (dateString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - today.getTime();
    return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  }

  // Lekérjük a meccsek számát tabonként
  useEffect(() => {
    const loadCount = async () => {
      setIsCountLoading(true);
      setCount(0);
      try {
        const countData = await fetchMatchesCount(activeTab);
        if (typeof countData === "number") {
          setCount(countData);
        }
      } finally {
        setIsCountLoading(false);
      }
    };
    loadCount();
  }, [activeTab]);

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

  if (loading && allMatches.length === 0)
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
      {/* Tabok */}
      <div className="flex gap-2 mb-2">
        <button
          className={`px-4 py-2 rounded-md cursor-pointer bg-white border-b-2 ${activeTab === 'upcoming' ? 'border-blue-400 font-bold text-blue-400' : 'border-gray-200 text-gray-600'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Következő mérkőzések
        </button>
        <button
          className={`px-4 py-2 rounded-md cursor-pointer bg-white border-b-2 ${activeTab === 'past' ? 'border-blue-400 font-bold text-blue-400' : 'border-gray-200 text-gray-600'}`}
          onClick={() => setActiveTab('past')}
        >
          Múltbeli mérkőzések
        </button>
      </div>
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
              {allMatches.map((m) => (
                <TableRow
                  key={m._id}
                  className={clsx(
                    "text-center text-sm",
                    {
                      // Kiemelés a következő 7 napban lévő meccsekre
                      "bg-yellow-50 border-l-6 border-yellow-500 shadow-md":
                        isWithinNext7Days(m.date),
                    }
                  )}
                >
                  <TableCell
                    className={clsx("px-2 font-bold", {
                      "text-blue-700": m.type === "NB I",
                      "text-green-700": m.type === "Extra Liga",
                      "text-orange-700": m.type === "7s",
                      "text-purple-700": m.type === "UP torna",
                      "text-red-700": m.type === "Válogatott",
                      "text-gray-600": ![
                        "NB I",
                        "Extra Liga",
                        "7s",
                        "UP torna",
                        "Válogatott",
                      ].includes(m.type),
                    })}
                  >
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
                  <TableCell className="px-2 text-sm font-semibold text-red-400">
                    {m.home}
                  </TableCell>
                  <TableCell className="px-2 text-sm font-semibold text-green-400">
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
        {/* Load More gomb, ha van még több meccs ÉS legalább egy teljes oldalnyi van betöltve */}
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isCountLoading ? (
            <Skeleton className="w-40 h-10" />
          ) : allMatches.length >= LOAD_COUNT && allMatches.length < count ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleLoadMore}
              disabled={isFetching}
            >
              {isFetching
                ? "Betöltés..."
                : `További ${Math.min(LOAD_COUNT, count - allMatches.length)} mérkőzés betöltése`}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Összesen {count} mérkőzés
            </p>
          )}
        </div>
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

export default MatchListTable;
