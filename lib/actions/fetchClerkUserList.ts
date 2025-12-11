'use server'
import {  clerkClient } from "@clerk/nextjs/server";
import { convertToJSON } from "../utils/convertToJSON";
import { Result } from "@/types/types";

/**
 * Fetches list of Clerk users
 * 
 * @returns Result<any> - On success returns Clerk users, on error returns error message
 */
export const fetchClerkUserList = async (): Promise<Result<any>> => {
    try {
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList();
        return { success: true, data: convertToJSON(users) };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Error fetching Clerk users' 
        };
    }
};