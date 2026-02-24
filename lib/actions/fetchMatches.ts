"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { Match as MatchType } from "@/types/models";
import { Result } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { Types, PipelineStage } from "mongoose";

interface IFetchMatchesProps {
  limit?: number;
  skip?: number;
  sortOrder?: 'asc' | 'desc';
  dateFilter?: 'upcoming' | 'past';
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
  sortOrder = 'desc',
  dateFilter,
}: IFetchMatchesProps = {}): Promise<Result<MatchType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          dateParsed: {
            $ifNull: [
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y. %m. %d.",
                  onError: null,
                  onNull: null,
                },
              },
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y.%m.%d.",
                  onError: null,
                  onNull: null,
                },
              },
            ],
          },
        },
      },
    ];

    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      pipeline.push({
        $match: {
          dateParsed: dateFilter === 'upcoming' ? { $gte: today } : { $lt: today },
        },
      } as PipelineStage);
    }

    pipeline.push({
      $sort: { dateParsed: sortOrder === 'asc' ? 1 : -1 },
    } as PipelineStage);

    if (skip > 0) {
      pipeline.push({ $skip: skip } as PipelineStage);
    }

    if (limit > 0) {
      pipeline.push({ $limit: limit } as PipelineStage);
    }

    const matches = await Match.aggregate(pipeline).exec();

    return JSON.parse(JSON.stringify(matches));
  }, 'Error fetching matches');
};

export const fetchMatchesCount = async (
  dateFilter?: 'upcoming' | 'past'
): Promise<number> => {
  await connectDB();
  try {
    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          dateParsed: {
            $ifNull: [
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y. %m. %d.",
                  onError: null,
                  onNull: null,
                },
              },
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y.%m.%d.",
                  onError: null,
                  onNull: null,
                },
              },
            ],
          },
        },
      },
    ];

    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      pipeline.push({
        $match: {
          dateParsed: dateFilter === 'upcoming' ? { $gte: today } : { $lt: today },
        },
      } as PipelineStage);
    }

    pipeline.push({ $count: "count" } as PipelineStage);

    const result = await Match.aggregate(pipeline).exec();
    return result?.[0]?.count ?? 0;
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
    if (!Types.ObjectId.isValid(matchId)) {
      throw new Error("Invalid match ID format");
    }

    await connectDB();
    const match = await Match.findById(matchId).lean().exec();
    return match ? JSON.parse(JSON.stringify(match)) : null;
  }, "Error fetching match by ID");
};
