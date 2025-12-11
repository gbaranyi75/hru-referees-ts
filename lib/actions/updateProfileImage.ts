"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Updates user profile image
 * 
 * @param {string} imageUrl - The new profile image URL
 * @returns {Promise<{success: boolean, error: boolean} | Error>} - On success returns success:true, on error returns Error object
 * @throws {Error} - If database error occurs
 * 
 * @example
 * const result = await updateProfileImage("https://example.com/new-profile-pic.jpg");
 * if (result.success) {
 *   console.log("Profile image successfully updated");
 * }
 */
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
