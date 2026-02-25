"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

import { ActionResult } from "@/types/result";
import { User as UserType, Address } from "@/types/models";
import { profileUpdateSchema } from "../profileSchema";

/**
 * Fetches the currently logged in user's profile.
 */
export const fetchProfile = async (): Promise<ActionResult<UserType>> => {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const loggedInUser = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    }).lean();

    if (!loggedInUser) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(loggedInUser)),
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error fetching profile",
    };
  }
};

/**
 * Updates basic profile data (name + social links).
 */
export const updateProfileData = async (
  userName: string,
  fbUrl: string,
  instaUrl: string,
): Promise<ActionResult<null>> => {
  try {
    const validation = profileUpdateSchema.safeParse({
      userName,
      fbUrl: fbUrl || undefined,
      instaUrl: instaUrl || undefined,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    await connectDB();
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    await User.findOneAndUpdate(
      { email: user.emailAddresses[0].emailAddress },
      {
        username: userName,
        facebookUrl: fbUrl,
        instagramUrl: instaUrl,
      },
    );

    revalidatePath("/profil");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error updating profile",
    };
  }
};

/**
 * Updates contact-related profile data.
 */
export const updateProfileContactData = async (
  address: Address,
  status: string,
  phoneNumber: string,
): Promise<ActionResult<null>> => {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    await User.findOneAndUpdate(
      { email: user.emailAddresses[0].emailAddress },
      { status, address, phoneNumber },
    );

    revalidatePath("/profil");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error updating profile contact data:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error updating contact data",
    };
  }
};

/**
 * Updates the user's profile image URL.
 */
export const updateProfileImage = async (imageUrl: string) => {
  await connectDB();
  try {
    const user = await currentUser();
    await User.findOneAndUpdate(
      { email: user?.emailAddresses[0].emailAddress },
      { image: imageUrl },
    );
    revalidatePath("/profil");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

/**
 * Fetches only the profile image URL of the current user.
 */
export const fetchProfileImage = async (): Promise<ActionResult<string>> => {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const loggedInUser = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });

    if (!loggedInUser) {
      return { success: false, error: "Profile not found" };
    }
    if (!loggedInUser.image) {
      return { success: false, error: "Profile image not found" };
    }

    return { success: true, data: loggedInUser.image };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error fetching profile image",
    };
  }
};

/**
 * Updates the user's password using a reset/verify token.
 */
export async function updatePassword(params: {
  newPassword: string;
  token: string;
}) {
  const { newPassword, token } = params;

  await connectDB();
  const salt = await bcrypt.genSalt(8);
  const passwordHashed = await bcrypt.hash(newPassword, salt);

  const res = await User.findOneAndUpdate(
    { verifyToken: token },
    { password: passwordHashed },
  );

  return res;
}

