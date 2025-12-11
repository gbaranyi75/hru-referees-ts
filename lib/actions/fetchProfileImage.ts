'use server'

import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { Result } from "@/types/types";

/**
 * Fetches user profile image
 * 
 * @returns Result<string> - On success returns profile image URL, on error returns error message
 */
export const fetchProfileImage = async (): Promise<Result<string>> => {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }

    const loggedInUser = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });

    if (!loggedInUser) {
      return { success: false, error: 'Profile not found' };
    }
    
    return { success: true, data: loggedInUser.image };
  } catch (error) {
    console.error(error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error fetching profile image' 
    };
  }
};