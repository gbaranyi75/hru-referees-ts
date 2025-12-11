'use server'

import connectDB from "@/config/database";
import Media from "@/models/Media";
import { revalidatePath } from "next/cache";

/**
 * Updates a media link in the database
 * 
 * @param {string | undefined} id - The media ID to update
 * @param {string} name - The new media name
 * @param {string} mediaUrl - The new media URL
 * @returns {Promise<{success: boolean, error: boolean} | Error>} - On success returns success:true, on error returns Error object
 * @throws {Error} - If database error occurs
 * 
 * @example
 * const result = await updateMedia("media123", "Updated video", "https://youtube.com/watch?v=...");
 * if (result.success) {
 *   console.log("Media successfully updated");
 * }
 */
export const updateMedia = async (id: string | undefined, name: string, mediaUrl: string) => {
    await connectDB();
  
    try {
      await Media.findOneAndUpdate(
        { _id: id },
        { name: name, mediaUrl: mediaUrl }
      );
      revalidatePath('/dashboard/media');
      return { success: true, error: false };
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : String(error));
    }
  };