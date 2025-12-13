"use server";

import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { Result, UserSelection as UserSelectionType } from "@/types/types";

/**
 * Fetches all user selections for the given calendar IDs.
 * Used for admin/summary views.
 * @param calendarIds - Array of calendar IDs
 * @returns All user selections for the given calendars
 */
export const fetchAllUserSelections = async (
  calendarIds: string[]
): Promise<Result<UserSelectionType[]>> => {
  try {
    await connectDB();

    // Single query for all selections (all users)
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
