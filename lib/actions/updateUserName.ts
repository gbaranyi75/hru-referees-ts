"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export const updateUserName = async (userName: string) => {
  await connectDB();
  try {
    const user = await currentUser();
    await User.findOneAndUpdate(
      { email: user?.emailAddresses[0].emailAddress },
      { username: userName }
    );
    revalidatePath("/profile");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
