'use server'
import connectDB from "@/config/database";
import User from "@/models/User";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchUsers = async () => {
  await connectDB();
  try {
    const users = await User.find().lean();
    if (!users) return null;
    return convertToJSON(users);
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
