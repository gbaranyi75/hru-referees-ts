"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Address, Result } from "@/types/types";

/**
 * Updates user profile contact data
 * 
 * @param {Address} address - The user's address
 * @param {string} status - The user's status
 * @param {string} phoneNumber - The user's phone number
 * @returns {Promise<Result<null>>} - On success {success: true, data: null}, on error {success: false, error: string}
 * 
 * @example
 * const result = await updateProfileContactData(
 *   { city: "Budapest", zipCode: "1000" },
 *   "active",
 *   "+36201234567"
 * );
 * if (result.success) {
 *   console.log("Contact data successfully updated");
 * }
 */
export const updateProfileContactData = async (
  address: Address,
  status: string,
  phoneNumber: string
): Promise<Result<null>> => {
  try {
    await connectDB();
    const user = await currentUser();
    
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }
    
    await User.findOneAndUpdate(
      { email: user.emailAddresses[0].emailAddress },
      { status: status, address: address, phoneNumber: phoneNumber },
    );
    revalidatePath("/profil");
    return { success: true, data: null };
  } catch (error) {
    console.error('Error updating profile contact data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error updating contact data' 
    };
  }
};
