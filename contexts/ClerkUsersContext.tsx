"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchClerkUserList } from "@/lib/actions/fetchClerkUserList";
import { ClerkUser } from "@/types/models";

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
  const [clerkUsers, setClerkUsers] = useState<ClerkUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshClerkUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchClerkUserList();
      if (result.success) {
        setClerkUsers(result.data);
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
    refreshClerkUsers();
  }, []);

  return (
    <ClerkUsersContext.Provider value={{ clerkUsers, loading, error, refreshClerkUsers }}>
      {children}
    </ClerkUsersContext.Provider>
  );
};

export const useClerkUsers = () => useContext(ClerkUsersContext);
