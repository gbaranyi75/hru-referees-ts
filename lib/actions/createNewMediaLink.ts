"use server";

import connectDB from "@/config/database";
import Media from "@/models/Media";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Creates a new media link in the database
 * 
 * @param {string} mediaName - The media name
 * @param {string} videoUrl - The video URL
 * @returns {Promise<{success: boolean, error: boolean} | {error: string} | Error>} - On success returns success:true, on error returns error message or Error object
 * @throws {Error} - If user is not logged in or database error occurs
 * 
 * @example
 * const result = await createNewMediaLink("Match video", "https://youtube.com/watch?v=...");
 * if (result.success) {
 *   console.log("Media link successfully created");
 * }
 */
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
