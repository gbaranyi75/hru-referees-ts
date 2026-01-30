"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { User } from "@/types/types";

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
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchUsers();
      if (result.success) {
        setUsers(result.data);
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
    refreshUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, loading, error, refreshUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
