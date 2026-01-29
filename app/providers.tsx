"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsersProvider } from "@/contexts/UsersContext";
import { GuestUsersProvider } from "@/contexts/GuestUsersContext";
import { ClerkUsersProvider } from "@/contexts/ClerkUsersContext";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UsersProvider>
        <GuestUsersProvider>
          <ClerkUsersProvider>{children}</ClerkUsersProvider>
        </GuestUsersProvider>
      </UsersProvider>
    </QueryClientProvider>
  );
}
