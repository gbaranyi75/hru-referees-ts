'use server'
import {  clerkClient } from "@clerk/nextjs/server";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchClerkUserList = async () => {
    try {
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList();
        return convertToJSON(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};