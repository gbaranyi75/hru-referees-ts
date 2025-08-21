"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchProfile = async () => {
  await connectDB();
  const user = await currentUser();
  if (!user) return null;
  try {
    const loggedInUser = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });
    if (!loggedInUser) return null;
    return convertToJSON(loggedInUser);
    //return loggedInUser.toObject();
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
