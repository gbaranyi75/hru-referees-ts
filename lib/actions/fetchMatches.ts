"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { convertToJSON } from "../utils/convertToJSON";
import { Match as MatchType } from "@/types/types";

interface IFetchMatchesProps {
  limit?: number;
  skip?: number;
}

export const fetchMatches = async ({
  limit = 0,
  skip = 0,
}: IFetchMatchesProps = {}): Promise<MatchType[]> => {
  await connectDB();
  try {
    const matches = await Match.find()
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    if (matches.length === 0) {
      return [];
    }
    return convertToJSON(matches);
  } catch (error) {
    console.error(error);
    throw new Error(
      `Error fetching matches: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error }
    );
  }
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
