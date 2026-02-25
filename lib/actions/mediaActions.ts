'use server';

import connectDB from "@/config/database";
import Media from "@/models/Media";
import { Media as MediaType } from "@/types/models";
import { ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Fetches media items from the database.
 */
export const fetchMedia = async (): Promise<ActionResult<MediaType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const media = await Media.find().lean();
    return JSON.parse(JSON.stringify(media));
  }, "Error fetching media");
};

/**
 * Creates a new media link in the database.
 */
export const createNewMediaLink = async (
  mediaName: string,
  videoUrl: string,
) => {
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
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

/**
 * Updates an existing media link.
 */
export const updateMedia = async (
  id: string | undefined,
  name: string,
  mediaUrl: string,
) => {
  await connectDB();

  try {
    await Media.findOneAndUpdate(
      { _id: id },
      { name: name, mediaUrl: mediaUrl },
    );

    revalidatePath("/dashboard/media");

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

