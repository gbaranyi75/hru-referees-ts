"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { convertToJSON } from "../utils/convertToJSON";

// Fetch a single user by their Clerk User ID
export const fetchSingleUser = async (userId: string) => {
    await connectDB();
    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) return null;
        return convertToJSON(user);
    } catch (error) {
        console.error(error);
        return new Error(error instanceof Error ? error.message : String(error));
    }
};
