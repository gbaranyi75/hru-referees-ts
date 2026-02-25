"use client";

import React, { createContext, useContext } from "react";
import { fetchUsers } from "@/lib/actions/userActions";
import { User } from "@/types/models";
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

const FETCH_ERROR = "Nem sikerült lekérni a felhasználókat.";
const REQUEST_ERROR = "Hiba történt a lekérés során.";

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, loading, error, refresh } = useRefreshableResource({
    fetcherAction: fetchUsers,
    fetchErrorMessage: FETCH_ERROR,
    requestErrorMessage: REQUEST_ERROR,
  });

  return (
    <UsersContext.Provider
      value={{ users: data ?? null, loading, error, refreshUsers: refresh }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
