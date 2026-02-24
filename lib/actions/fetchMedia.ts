'use server'
import connectDB from "@/config/database";
import Media from "@/models/Media";
import { Media as MediaType } from "@/types/models";
import { Result } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

/**
 * Fetches media items from the database
 * 
 * @returns Result<MediaType[]> - On success returns array of media items, on error returns error message
 * 
 * @example
 * ```typescript
 * import { isSuccess, unwrapArrayResult } from "@/lib/utils/typeGuards";
 * 
 * const result = await fetchMedia();
 * const media = unwrapArrayResult(result);
 * ```
 */
export const fetchMedia = async (): Promise<Result<MediaType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const media = await Media.find().lean();
    return JSON.parse(JSON.stringify(media));
  }, 'Error fetching media');
};
