"use client";

import React, { createContext, useContext } from "react";

import { fetchClerkUserList } from "@/lib/actions/fetchClerkUserList";
import { useRefreshableResource } from "@/hooks/useRefreshableResource";
import { ClerkUser } from "@/types/types";

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

export const ClerkUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: clerkUsers,
    loading,
    error,
    refresh: refreshClerkUsers,
  } = useRefreshableResource<ClerkUser[]>({
    fetcher: fetchClerkUserList,
    fetchErrorMessage: "Nem sikerült lekérni a felhasználókat.",
    requestErrorMessage: "Hiba történt a lekérés során.",
  });

  return (
    <ClerkUsersContext.Provider
      value={{ clerkUsers, loading, error, refreshClerkUsers }}
    >
      {children}
    </ClerkUsersContext.Provider>
  );
};

export const useClerkUsers = () => useContext(ClerkUsersContext);
