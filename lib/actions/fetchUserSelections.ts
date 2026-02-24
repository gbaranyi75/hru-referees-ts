"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { UserSelection as UserSelectionType } from "@/types/models";
import { Result } from "@/types/result";

/**
 * Fetches multiple calendar selections at once for the given user.
 * More efficient than fetching each calendar separately.
 * @param calendarIds - Array of calendar IDs
 * @param clerkUserId - The user's Clerk ID
 * @returns All user selections for the given calendars
 */
export const fetchUserSelections = async (
  calendarIds: string[],
  clerkUserId: string
): Promise<Result<UserSelectionType[]>> => {
  try {
    await connectDB();

    if (!clerkUserId) {
      return { success: true, data: [] };
    }

    // Single query for all selections
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
        error instanceof Error ? error.message : "Error fetching user selections",
    };
  }
};
