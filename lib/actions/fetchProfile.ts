"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { Result } from "@/types/types";
import { User as UserType } from "@/types/types";

export const fetchProfile = async (): Promise<Result<UserType>> => {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }
    
    const loggedInUser = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    }).lean();
    
    if (!loggedInUser) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(loggedInUser)) };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error fetching profile' 
    };
  }
};
