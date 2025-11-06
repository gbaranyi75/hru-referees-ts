'use server'

import connectDB from "@/config/database";
import Media from "@/models/Media";
import { revalidatePath } from "next/cache";

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