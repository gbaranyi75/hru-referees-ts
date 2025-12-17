"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { Result, UserSelection as UserSelectionType } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

/**
 * Fetches a user's selection for a specific calendar
 *
 * @param calendarId - The calendar ID
 * @returns Result<UserSelectionType | null> - On success returns the selection or null, on error returns error message
 *
 * @example
 * ```typescript
 * import { isSuccess, unwrapNullableResult } from "@/lib/utils/typeGuards";
 *
 * const result = await fetchUserSelection(calendarId);
 *
 * if (isSuccess(result)) {
 *   if (result.data) {
 *     setSelection(result.data);
 *   }
 * } else {
 *   toast.error(result.error);
 * }
 * ```
 */
export const fetchUserSelection = async (
  calendarId: string | undefined
): Promise<Result<UserSelectionType | null>> => {
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
