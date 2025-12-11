"use server";

import connectDB from "@/config/database";
import Media from "@/models/Media";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createNewMediaLink = async (mediaName: string, videoUrl: string) => {
    await connectDB();
    const user = await currentUser();
    if (!user) {
        return { error: "You must be logged in to create a match" };
    }
    try {
        const newMedia = new Media({
            name: mediaName,
            mediaUrl: videoUrl,
        });
        await newMedia.save();
        revalidatePath("/dashboard/media");
        return { success: true, error: false };
    } catch (error) {
        console.error(error);
        return new Error(
            error instanceof Error ? error.message : String(error)
        );
    }
};
