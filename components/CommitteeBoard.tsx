"use client";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { User } from "@/types/types";

const CommitteeBoard = () => {
  const [president, setPresident] = useState<User | null>(null);
  const [secretary, setSecretary] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUsers = async () => {
      const result = await fetchUsers();
      if (result.success) {
        const fetchedUsers = result.data;
        setPresident(
          () => fetchedUsers.filter((pres: User) => pres.hasTitle === "Elnök")[0]
        );
        setSecretary(
          () =>
            fetchedUsers.filter((pres: User) => pres.hasTitle === "Főtitkár")[0]
        );
      }
      setLoading(false);
    };
    getUsers();
  }, []);

  if (loading && !president && !secretary) {
    return (
      <div className="flex flex-col gap-4 lg:h-96 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="w-full h-8 mb-2 bg-gray-200 animate-pulse"></div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-full h-4 bg-gray-200 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:h-96 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-2xl font-bold">Elnökség</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h6 className="text-gray-600 mb-2">Elnök:</h6>
          <div className="text-gray-600 text-sm font-semibold">
            {president?.username || "Átmenetileg nem elérhető"}
          </div>
          <div className="text-gray-600">
            <span className="text-xs">Email: </span>
            {president?.email ? (
              <a
                className="text-xs text-blue-500 underline"
                href={`mailto:${president.email}`}
              >
                {president.email}
              </a>
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </div>
          <div className="text-gray-600">
            <span className="text-xs">Telefon: </span>
            {president?.phoneNumber ? (
              <a
                className="text-xs text-blue-500 underline"
                href={`tel:${president.phoneNumber}`}
              >
                {president.phoneNumber}
              </a>
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h6 className="text-gray-600 mb-2">Főtitkár:</h6>
            <div className="text-gray-600 font-semibold text-sm">
              {secretary?.username || "Átmenetileg nem elérhető"}
            </div>
            <div className="text-gray-600">
              <span className="text-xs">Email: </span>
              {secretary?.email ? (
                <a
                  className="text-xs text-blue-500 underline"
                  href={`mailto:${secretary.email}`}
                >
                  {secretary.email}
                </a>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </div>
            <div className="text-gray-600">
              <span className="text-xs">Telefon: </span>
              {secretary?.phoneNumber ? (
                <a
                  className="text-xs text-blue-500 underline"
                  href={`tel:${secretary.phoneNumber}`}
                >
                  {secretary.phoneNumber}
                </a>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeBoard;
