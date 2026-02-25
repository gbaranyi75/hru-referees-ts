"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import GuestUser from "@/models/GuestUser";
import { User as UserType, GuestUser as GuestUserType, Address } from "@/types/models";
import { Result, ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ErrorMessages, EmailSubjects } from "@/constants/messages";
import { sendEmail } from "./sendEmail";

/**
 * Fetches users from the database
 */
export const fetchUsers = async (): Promise<Result<UserType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const users = await User.find().lean();
    return JSON.parse(JSON.stringify(users));
  }, "Error fetching users");
};

/**
 * Fetches a single user by Clerk User ID
 */
export const fetchSingleUser = async (
  userId: string
): Promise<Result<UserType>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const user = await User.findOne({ clerkUserId: userId }).lean();

    if (!user) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(user));
  }, "Error fetching user");
};

/**
 * Approves a user registration.
 * Updates user metadata in Clerk, creates user record in DB if needed, sends approval email.
 */
export async function approveUser(
  userId: string
): Promise<ActionResult<null>> {
  return handleAsyncOperation(async () => {
    await connectDB();

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        approved: true,
        approvedWelcomeShown: false,
        role: "user",
      },
    });

    const user = await clerk.users.getUser(userId);

    let dbUser = await User.findOne({ clerkUserId: userId });
    if (!dbUser) {
      dbUser = await User.create({
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
        clerkUserId: userId,
        username: `${user.lastName} ${user.firstName}`,
        image: user.imageUrl ?? undefined,
        address: { city: "", country: "Magyarország" },
        phoneNumber: "",
        hasTitle: "Nincs",
        status: "Nincs megadva",
        facebookUrl: "",
        instagramUrl: "",
      });
    }

    const emailResult = await sendEmail({
      to: user.emailAddresses?.[0]?.emailAddress ?? "",
      type: "user-approved",
      username: `${user.lastName} ${user.firstName}`,
    });

    if (!emailResult.success) {
      console.warn("Email sending failed, but user was approved:", emailResult.error);
    }

    return null;
  }, ErrorMessages.USER.APPROVAL_FAILED);
}

/**
 * Rejects a user registration.
 * Sends rejection email and deletes user from Clerk.
 */
export async function rejectUser(
  userId: string
): Promise<ActionResult<null>> {
  return handleAsyncOperation(async () => {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    await sendEmail({
      to: user.emailAddresses?.[0]?.emailAddress ?? "",
      type: "user-rejected",
      username: `${user.lastName} ${user.firstName}`,
      subject: EmailSubjects.REGISTRATION_REJECTED,
    });

    await clerk.users.deleteUser(userId);
    return null;
  }, ErrorMessages.USER.REJECTION_FAILED);
}

/**
 * Updates user status and title in DB and syncs role in Clerk metadata
 */
export const updateProfileStatusAndTitle = async (
  clerkUserId: string,
  status: string,
  title: string,
  role: string
): Promise<{ success: boolean; error: boolean } | Error> => {
  await connectDB();
  try {
    const clerk = await clerkClient();

    await User.findOneAndUpdate(
      { clerkUserId: clerkUserId },
      { status: status, hasTitle: title }
    );

    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { role: role },
    });
    revalidatePath("/dashboard/referees", "page");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

// --- Guest users ---

export interface CreateGuestUserData {
  userName: string;
  address: Address;
  status: string;
  isGuest: boolean;
}

/**
 * Creates a guest referee in the database
 */
export async function createGuestUser(
  data: CreateGuestUserData
): Promise<Result<null>> {
  try {
    await connectDB();
    const guestUser = new GuestUser({
      username: data.userName,
      address: data.address,
      status: data.status,
      isGuest: data.isGuest,
    });

    await guestUser.save();
    revalidatePath("/dashboard/referees");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error creating guest user:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Hiba történt a vendég játékvezető létrehozásakor",
    };
  }
}

/**
 * Fetches guest users from the database
 */
export const fetchGuestUsers = async (): Promise<
  Result<GuestUserType[]>
> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const users = await GuestUser.find().lean();
    return JSON.parse(JSON.stringify(users));
  }, "Error fetching guest users");
};
