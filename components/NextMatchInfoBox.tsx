"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Route } from "next";
import clsx from "clsx";
import Skeleton from "./common/Skeleton";
import { Match } from "@/types/types";
import { fetchMatches } from "@/lib/actions/fetchMatches";

const NextMatchInfoBox = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noMatch, setNoMatch] = useState<boolean>(false);

  const loadMatches = async () => {
    setLoading(true);
    const fetchedMatches = await fetchMatches();
    if (!fetchedMatches) return setNoMatch(true);

    const firstDay = new Date();
    const nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);

    const arr: Match[] = [];
    fetchedMatches.forEach((match: Match) => {
      if (
        new Date(match.date) < nextWeek &&
        new Date(match.date) >= new Date()
      ) {
        arr.push(match);
        setMatches(arr);
      }
    });
    if (arr.length === 0) setNoMatch(true);
    setLoading(false);
  };

  const checkType = (m: Match) => {
    const isSingleMatch = m.type === "NB I" || m.type === "Extra Liga";
    return isSingleMatch;
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div className="flex flex-col lg:h-96 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-2xl font-bold">Soron következő mérkőzések</h2>
      {loading ? (
        <div className="grid gap-4 mt-5">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>
      ) : (
        <>
          {!noMatch ? (
            <div className="flex flex-col overflow-hidden overflow-y-auto gap-2">
              {matches.map((m) => (
                <div
                  key={m._id}
                  className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 bg-gray-100 rounded-xl border-b border-gray-300 text-gray-600 py-4">
                  <div className="flex mt-2 lg:flex-row lg:mt-0 lg:gap-16">
                    <div className="flex flex-col gap-1 lg:gap-2 justify-center text-sm items-center lg:items-start">
                      <div className="font-semibold">{m.venue}</div>
                      <div className="flex lg:gap-2 text-xs">
                        <div>{m.date}</div>
                        <div>{m.time}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {checkType(m) && (
                      <div className="flex flex-row space-x-6 items-center mt-1 lg:mt-0">
                        <h3 className="text-md font-semibold text-red-600">
                          {m.home}
                        </h3>
                        <h3 className="text-xs">vs</h3>
                        <h3 className="text-md font-semibold text-green-600">
                          {m.away}
                        </h3>
                      </div>
                    )}
                  </div>
                  <div>
                    <div
                      className={clsx(
                        "flex mx-auto w-50 px-2 py-1 rounded-2xl justify-center",
                        {
                          "bg-blue-200 text-blue-700": m.type === "NB I",
                          "bg-green-200 text-green-700":
                            m.type === "Extra Liga",
                          "bg-orange-200 text-orange-700": m.type === "7s",
                          "bg-purple-200 text-purple-700":
                            m.type === "UP torna",
                        }
                      )}>
                      <h3 className="pr-1 text-sm">{m.age}</h3>
                      <h3 className="px-1 text-sm">{m.gender}</h3>
                      <h3 className="pl-1 text-sm font-semibold">{m.type}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full h-full justify-center items-center">
              <p className="text-xl font-semibold text-gray-600">
                A következő 7 napban nem lesz mérkőzés.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Ha kíváncsi vagy a későbbi meccsekre, kattints a linkre:
              </p>
              <Link
                href={"/merkozesek" as Route}
                className="inline-block bg-cyan-900 text-white text-center rounded-lg px-4 py-2 hover:opacity-80 mt-4">
                További mérkőzések
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NextMatchInfoBox;
