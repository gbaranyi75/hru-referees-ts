'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchGuestUsers } from "@/lib/actions/fetchGuestUser";
import { GuestUser } from "@/types/models";

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
  const [guestUsers, setGuestUsers] = useState<GuestUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGuestUsers()
      .then((result) => {
        if (result.success) {
          setGuestUsers(result.data);
        } else {
          setError("Nem sikerült lekérni a felhasználókat.");
        }
      })
      .catch(() => setError("Hiba történt a lekérés során."))
      .finally(() => setLoading(false));
  }, []);

    const refreshGuestUsers = async () => {
      setLoading(true);
      try {
        const result = await fetchGuestUsers();
        if (result.success) {
          setGuestUsers(result.data);
          setError(null);
        } else {
          setError("Nem sikerült lekérni a felhasználókat.");
        }
      } catch {
        setError("Hiba történt a lekérés során.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      refreshGuestUsers();
    }, []);

  return (
    <GuestUsersContext.Provider value={{ guestUsers, loading, error, refreshGuestUsers }}>
      {children}
    </GuestUsersContext.Provider>
  );
};

export const useGuestUsers = () => useContext(GuestUsersContext);
