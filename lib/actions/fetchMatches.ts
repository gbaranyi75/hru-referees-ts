'use server'
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchMatches = async () => {
  await connectDB();
  try {
    const matches = await Match.find().lean();
    if (!matches) return null;
    return convertToJSON(matches);
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
