'use server'
import {  clerkClient } from "@clerk/nextjs/server";
import { convertToJSON } from "../utils/convertToJSON";
import { Result, ClerkUser as ClerkUserType } from "@/types/types";

/**
 * Fetches list of Clerk users
 * 
 * @returns Result<ClerkUser[]> - On success returns Clerk users, on error returns error message
 */
export const fetchClerkUserList = async (): Promise<Result<ClerkUserType[]>> => {
    try {
        const clerk = await clerkClient();
        const { data: users } = await clerk.users.getUserList({ limit: 300 });
        return { success: true, data: convertToJSON(users) as ClerkUserType[] };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Error fetching Clerk users' 
        };
    }
};