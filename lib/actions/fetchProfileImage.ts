'use server'

import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const fetchProfileImage = async () => {
  await connectDB();
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    const loggedInUser = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });

    if (!loggedInUser) throw new Error("Profile not found");
    return loggedInUser.image;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};