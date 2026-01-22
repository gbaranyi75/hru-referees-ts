'use server'
import { clerkClient } from "@clerk/nextjs/server";

export type PendingUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt?: string;
};

/**
 * Fetch all users from Clerk who are not yet approved
 * Only for admin usage!
 */
export async function fetchPendingUsers(): Promise<PendingUser[]> {
  const clerk = await clerkClient();
  // Az összes user lekérése Clerk-ból (a válasz egy objektum, nem tömb!)
  const response = await clerk.users.getUserList();
  const users = response.data; // Itt van a user tömb
  // Szűrés: csak azok, akiknél approved: false
  const pendingUsers = users.filter(
    (u) => u.publicMetadata?.approved === false
  );
  
  return pendingUsers.map((u) => ({
    id: u.id,
    email: u.emailAddresses?.[0]?.emailAddress ?? "",
    name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username ?? "",
    image: u.imageUrl ?? undefined,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
  }));
}
