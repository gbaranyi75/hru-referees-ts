"use client";

import React, { createContext, useContext } from "react";
import { fetchClerkUserList } from "@/lib/actions/clerkActions";
import { ClerkUser } from "@/types/models";
import { useRefreshableResource } from "@/hooks/useRefreshableResource";

type ClerkUsersContextType = {
  clerkUsers: ClerkUser[] | null;
  loading: boolean;
  error: string | null;
  refreshClerkUsers: () => Promise<void>;
};

const ClerkUsersContext = createContext<ClerkUsersContextType>({
  clerkUsers: null,
  loading: true,
  error: null,
  refreshClerkUsers: async () => {},
});

const FETCH_ERROR = "Nem sikerült lekérni a felhasználókat.";
const REQUEST_ERROR = "Hiba történt a lekérés során.";

export const ClerkUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, loading, error, refresh } = useRefreshableResource({
    fetcherAction: fetchClerkUserList,
    fetchErrorMessage: FETCH_ERROR,
    requestErrorMessage: REQUEST_ERROR,
  });

  return (
    <ClerkUsersContext.Provider
      value={{
        clerkUsers: data ?? null,
        loading,
        error,
        refreshClerkUsers: refresh,
      }}
    >
      {children}
    </ClerkUsersContext.Provider>
  );
};

export const useClerkUsers = () => useContext(ClerkUsersContext);
