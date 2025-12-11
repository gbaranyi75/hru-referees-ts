'use server'

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Updates user status and title, and syncs Clerk metadata
 * 
 * @param {string} clerkUserId - The Clerk user identifier
 * @param {string} status - The new status
 * @param {string} title - The new title
 * @param {string} role - The new role (also updated in Clerk metadata)
 * @returns {Promise<{success: boolean, error: boolean} | Error>} - On success returns success:true, on error returns Error object
 * @throws {Error} - If database or Clerk API error occurs
 * 
 * @example
 * const result = await updateProfileStatusAndTitle(
 *   "user_123",
 *   "active",
 *   "President",
 *   "admin"
 * );
 * if (result.success) {
 *   console.log("Status, title and role successfully updated");
 * }
 */
export const updateProfileStatusAndTitle = async (clerkUserId: string, status: string, title: string, role: string) => {
    await connectDB();
    try {
        const clerk = await clerkClient(); // Get the ClerkClient instance
        console.log(role)

        await User.findOneAndUpdate(
            { clerkUserId: clerkUserId },
            { status: status, hasTitle: title },
        );

        await clerk.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
                role: role,
            },
        });
        revalidatePath("/dashboard/referees", "page");
        return { success: true, error: false };
    } catch (error) {
        console.error(error);
        return new Error(error instanceof Error ? error.message : String(error));
    }
};