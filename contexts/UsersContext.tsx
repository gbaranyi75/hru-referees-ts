"use client";

import React, { createContext, useContext } from "react";

import { fetchUsers } from "@/lib/actions/fetchUsers";
import { User } from "@/types/types";
import { useRefreshableResource } from "@/hooks/useRefreshableResource";

type UsersContextType = {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
};

const UsersContext = createContext<UsersContextType>({
  users: null,
  loading: true,
  error: null,
  refreshUsers: async () => {},
});

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: users,
    loading,
    error,
    refresh: refreshUsers,
  } = useRefreshableResource<User[]>({
    fetcher: fetchUsers,
    fetchErrorMessage: "Nem sikerült lekérni a felhasználókat.",
    requestErrorMessage: "Hiba történt a lekérés során.",
  });

  return (
    <UsersContext.Provider value={{ users, loading, error, refreshUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
