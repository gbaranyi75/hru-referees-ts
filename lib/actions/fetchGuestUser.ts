'use server'
import connectDB from "@/config/database";
import GuestUser from "@/models/GuestUser";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchGuestUsers = async () => {
  await connectDB();
  try {
    const users = await GuestUser.find().lean();
    if (!users) return null;
    return convertToJSON(users);
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
