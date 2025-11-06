'use server'
import connectDB from "@/config/database";
import Media from "@/models/Media";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchMedia = async () => {
  await connectDB();
  try {
    const media = await Media.find().lean();
    if (!media) return null;
    return convertToJSON(media);
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
