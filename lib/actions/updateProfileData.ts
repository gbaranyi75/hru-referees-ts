"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Result } from "@/types/types";
import { profileUpdateSchema } from "../profileSchema";

export const updateProfileData = async (
  userName: string, fbUrl: string, instaUrl: string
): Promise<Result<null>> => {
  try {
    // Validálás
    const validation = profileUpdateSchema.safeParse({ 
      userName, 
      fbUrl: fbUrl || undefined, 
      instaUrl: instaUrl || undefined 
    });
    
    if (!validation.success) {
      return { 
        success: false, 
        error: validation.error.issues[0].message 
      };
    }
    
    await connectDB();
    const user = await currentUser();
    
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }
    
    await User.findOneAndUpdate(
      { email: user.emailAddresses[0].emailAddress },
      {
        username: userName,
        facebookUrl: fbUrl,
        instagramUrl: instaUrl
      }
    );
    revalidatePath("/profil");
    return { success: true, data: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error updating profile' 
    };
  }
};
