"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { convertToJSON } from "../utils/convertToJSON";
import { ClerkUser as ClerkUserType } from "@/types/models";
import { ActionResult } from "@/types/result";

export type PendingUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt?: string;
};

/**
 * Fetches list of Clerk users
 */
export const fetchClerkUserList = async (): Promise<
  ActionResult<ClerkUserType[]>
> => {
  try {
    const clerk = await clerkClient();
    const { data: users } = await clerk.users.getUserList({ limit: 300 });
    return { success: true, data: convertToJSON(users) as ClerkUserType[] };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error fetching Clerk users",
    };
  }
};

/**
 * Fetches all users from Clerk who are not yet approved.
 * Only for admin usage!
 */
export async function fetchPendingUsers(): Promise<PendingUser[]> {
  const clerk = await clerkClient();
  const response = await clerk.users.getUserList();
  const users = response.data;
  const pendingUsers = users.filter(
    (u) => u.publicMetadata?.approved === false
  );

  return pendingUsers.map((u) => ({
    id: u.id,
    email: u.emailAddresses?.[0]?.emailAddress ?? "",
    name:
      u.firstName && u.lastName
        ? `${u.firstName} ${u.lastName}`
        : u.username ?? "",
    image: u.imageUrl ?? undefined,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
  }));
}
