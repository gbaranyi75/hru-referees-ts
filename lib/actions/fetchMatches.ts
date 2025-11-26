"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { Match as MatchType } from "@/types/types";
import { convertToJSON } from "../utils/convertToJSON";

interface IFetchMatchesProps {
  limit?: number;
  skip?: number;
}

export const fetchMatches = async ({
  limit = 0,
  skip = 0,
}: IFetchMatchesProps = {}) => {
  await connectDB();
  try {
    const matches = await Match.find()
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();
    if (!matches) return null;
    return convertToJSON(matches);
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

export const fetchMatchesCount = async () => {
  await connectDB();
  try {
    const matchesCount = await Match.countDocuments({}).exec();
    return matchesCount;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
