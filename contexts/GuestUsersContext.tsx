"use client";

import React, { createContext, useContext } from "react";

import { fetchGuestUsers } from "@/lib/actions/fetchGuestUser";
import { useRefreshableResource } from "@/hooks/useRefreshableResource";
import { GuestUser } from "@/types/types";

type GuestUsersContextType = {
  guestUsers: GuestUser[] | null;
  loading: boolean;
  error: string | null;
  refreshGuestUsers: () => Promise<void>;
};

const GuestUsersContext = createContext<GuestUsersContextType>({
  guestUsers: null,
  loading: true,
  error: null,
  refreshGuestUsers: async () => {},
});

export const GuestUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: guestUsers,
    loading,
    error,
    refresh: refreshGuestUsers,
  } = useRefreshableResource<GuestUser[]>({
    fetcher: fetchGuestUsers,
    fetchErrorMessage: "Nem sikerült lekérni a felhasználókat.",
    requestErrorMessage: "Hiba történt a lekérés során.",
  });

  return (
    <GuestUsersContext.Provider
      value={{ guestUsers, loading, error, refreshGuestUsers }}
    >
      {children}
    </GuestUsersContext.Provider>
  );
};

export const useGuestUsers = () => useContext(GuestUsersContext);
