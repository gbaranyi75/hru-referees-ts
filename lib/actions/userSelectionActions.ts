"use server";

import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { UserSelection as UserSelectionType } from "@/types/models";
import { ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Fetches multiple calendar selections at once for the given user.
 */
export const fetchUserSelections = async (
  calendarIds: string[],
  clerkUserId: string
): Promise<ActionResult<UserSelectionType[]>> => {
  try {
    await connectDB();

    if (!clerkUserId) {
      return { success: true, data: [] };
    }

    const userSelectionData = await UserSelection.find({
      clerkUserId,
      calendarId: { $in: calendarIds },
    }).lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(userSelectionData)),
    };
  } catch (error) {
    console.error("Error fetching user selections:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error fetching user selections",
    };
  }
};

/**
 * Fetches a user's selection for a specific calendar
 */
export const fetchUserSelection = async (
  calendarId: string | undefined
): Promise<ActionResult<UserSelectionType | null>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      throw new Error("Not logged in");
    }

    const userSelectionData = await UserSelection.findOne({
      calendarId: calendarId,
      clerkUserId: user.id,
    }).lean();

    if (!userSelectionData) {
      return null;
    }

    return JSON.parse(JSON.stringify(userSelectionData));
  }, "Error fetching user selection");
};

/**
 * Fetches all user selections for the given calendar IDs (admin/summary views).
 */
export const fetchAllUserSelections = async (
  calendarIds: string[]
): Promise<ActionResult<UserSelectionType[]>> => {
  try {
    await connectDB();

    const selections = await UserSelection.find({
      calendarId: { $in: calendarIds },
    }).lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(selections)),
    };
  } catch (error) {
    console.error("Error fetching user selections:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error fetching user selections",
    };
  }
};

export interface SaveUserSelectionData {
  calendarName: string;
  calendarId?: string;
  selectedDays: string[];
  username: string;
  clerkUserId: string;
}

/**
 * Saves or updates user selection (upsert).
 */
export const saveUserSelection = async (data: SaveUserSelectionData) => {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "Be kell jelentkezned a mentéshez!" };
  }

  try {
    const updatedSelection = await UserSelection.findOneAndUpdate(
      {
        clerkUserId: data.clerkUserId,
        calendarId: data.calendarId,
      },
      {
        $set: {
          selectedDays: data.selectedDays,
          username: data.username,
          calendarName: data.calendarName,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    revalidatePath("/jv-elerhetoseg");

    return {
      success: true,
      selectionId: updatedSelection._id.toString(),
    };
  } catch (error) {
    console.error("Hiba a mentés során:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ismeretlen hiba",
    };
  }
};

/**
 * Updates user calendar selection by selection ID.
 */
export const updateUserSelection = async (
  selectionId: string | undefined,
  selectedDays: string[] | undefined
): Promise<{ success: boolean; error: boolean } | Error> => {
  await connectDB();

  try {
    await UserSelection.findOneAndUpdate(
      { _id: selectionId },
      { selectedDays: selectedDays }
    );
    revalidatePath("/jv-elerhetoseg");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

export interface CreateUserSelectionData {
  calendarName?: string;
  calendarId?: string;
  selectedDays: string[];
  username: string;
  clerkUserId: string;
}

/**
 * Creates a new user calendar selection.
 */
export const createNewUserSelection = async (
  data: CreateUserSelectionData
): Promise<
  | { success: true; error: false }
  | { error: string }
  | Error
> => {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    return { error: "You must be logged in to create a calendar" };
  }

  try {
    const newUserSelection = new UserSelection({
      calendarName: data.calendarName,
      calendarId: data.calendarId,
      selectedDays: data.selectedDays,
      username: data.username,
      clerkUserId: data.clerkUserId,
    });
    await newUserSelection.save();
    revalidatePath("/jv-elerhetoseg");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
