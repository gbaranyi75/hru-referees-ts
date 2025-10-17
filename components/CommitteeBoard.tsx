"use client";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { User } from "@/types/types";
const CommitteeBoard = () => {
  const [president, setPresident] = useState<User | null>(null);
  const [secretary, setSecretary] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const fetchedUsers = await fetchUsers();
      setPresident(
        () => fetchedUsers.filter((pres: User) => pres.hasTitle === "Elnök")[0]
      );
      setSecretary(
        () =>
          fetchedUsers.filter((pres: User) => pres.hasTitle === "Főtitkár")[0]
      );
      setLoading(false);
    };
    getUsers();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-2 lg:h-96 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="w-full h-8 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:h-96 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-2xl font-bold">Elnökség</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h6 className="text-gray-600 text-semibold mb-2">Elnök:</h6>
          <div className="text-gray-600 text-sm">{president?.username}</div>
          <div className="text-gray-600">
            <span className="text-xs">Email: </span>
            <span className="text-xs">{president?.email}</span>
          </div>
          <div className="text-gray-600">
            <span className="text-xs">Telefon: </span>
            <span className="text-xs">{president?.phoneNumber}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h6 className="text-gray-600 text-semibold mb-2">Főtitkár:</h6>
            <div className="text-gray-600 text-sm">{secretary?.username}</div>
            <div className="text-gray-600">
              <span className="text-xs">Email: </span>
              <span className="text-xs">{secretary?.email}</span>
            </div>
            <div className="text-gray-600">
              <span className="text-xs">Telefon: </span>
              <span className="text-xs">{secretary?.phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeBoard;
