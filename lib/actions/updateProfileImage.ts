"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export const updateProfileImage = async (imageUrl: string) => {
  await connectDB();
  try {
    const user = await currentUser();
    await User.findOneAndUpdate(
      { email: user?.emailAddresses[0].emailAddress },
      { image: imageUrl }
    );
    revalidatePath("/profil");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
