"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { Result, Match as MatchType } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

interface IFetchMatchesProps {
  limit?: number;
  skip?: number;
}

/**
 * Fetches matches from the database with pagination
 * 
 * @param limit - Maximum number of matches to fetch (0 = all)
 * @param skip - Number of matches to skip (for pagination)
 * @returns Result<MatchType[]> - On success returns array of matches, on error returns error message
 * 
 * @example
 * ```typescript
 * import { isSuccess, unwrapArrayResult } from "@/lib/utils/typeGuards";
 * 
 * const result = await fetchMatches({ limit: 10, skip: 0 });
 * 
 * if (isSuccess(result)) {
 *   const matches = result.data;
 *   // ... processing
 * } else {
 *   toast.error(result.error);
 * }
 * 
 * // Or safe unwrapping:
 * const matches = unwrapArrayResult(result);
 * ```
 */
export const fetchMatches = async ({
  limit = 0,
  skip = 0,
}: IFetchMatchesProps = {}): Promise<Result<MatchType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const matches = await Match.find()
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    return JSON.parse(JSON.stringify(matches));
  }, 'Error fetching matches');
};

export const fetchMatchesCount = async (): Promise<number> => {
  await connectDB();
  try {
    const matchesCount = await Match.countDocuments({}).exec();
    return matchesCount;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Error fetching matches count: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error }
    );
  }
};

/**
 * Fetches a single match by its ID
 *
 * @param matchId - The MongoDB ObjectId of the match
 * @returns Result<MatchType | null> - On success returns the match or null if not found
 *
 * @example
 * ```typescript
 * const result = await fetchMatchById("abc123");
 * if (result.success && result.data) {
 *   // Found the match
 * }
 * ```
 */
export const fetchMatchById = async (
  matchId: string
): Promise<Result<MatchType | null>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const match = await Match.findById(matchId).lean().exec();
    return match ? JSON.parse(JSON.stringify(match)) : null;
  }, "Error fetching match by ID");
};
