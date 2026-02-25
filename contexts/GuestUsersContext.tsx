"use client";

import React, { createContext, useContext } from "react";
import { fetchGuestUsers } from "@/lib/actions/userActions";
import { GuestUser } from "@/types/models";
import { useRefreshableResource } from "@/hooks/useRefreshableResource";

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

const FETCH_ERROR = "Nem sikerült lekérni a felhasználókat.";
const REQUEST_ERROR = "Hiba történt a lekérés során.";

export const GuestUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, loading, error, refresh } = useRefreshableResource({
    fetcherAction: fetchGuestUsers,
    fetchErrorMessage: FETCH_ERROR,
    requestErrorMessage: REQUEST_ERROR,
  });

  return (
    <GuestUsersContext.Provider
      value={{
        guestUsers: data ?? null,
        loading,
        error,
        refreshGuestUsers: refresh,
      }}
    >
      {children}
    </GuestUsersContext.Provider>
  );
};

export const useGuestUsers = () => useContext(GuestUsersContext);
