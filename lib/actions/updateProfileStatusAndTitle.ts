'use server'

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

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