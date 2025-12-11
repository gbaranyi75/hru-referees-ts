"use server";
import connectDB from "@/config/database";
import { currentUser } from "@clerk/nextjs/server";
import UserSelection from "@/models/Userselection";
import { revalidatePath } from "next/cache";

/**
 * Creates a new user calendar selection
 * 
 * @param {Object} data - The selection data
 * @param {string} [data.calendarName] - The calendar name (optional)
 * @param {string} [data.calendarId] - The calendar ID (optional)
 * @param {string[]} data.selectedDays - Array of selected days
 * @param {string} data.username - The username
 * @param {string} data.clerkUserId - The Clerk user ID
 * @returns {Promise<{success: boolean, error: boolean} | {error: string} | Error>} - On success returns success:true, on error returns error message or Error object
 * @throws {Error} - If user is not logged in or database error occurs
 * 
 * @example
 * const result = await createNewUserSelection({
 *   calendarName: "2024 Spring",
 *   calendarId: "cal123",
 *   selectedDays: ["2024-03-01", "2024-03-15"],
 *   username: "John Doe",
 *   clerkUserId: "user_123"
 * });
 * if (result.success) {
 *   console.log("Selection successfully created");
 * }
 */
export const createNewUserSelection = async (data: {
  calendarName?: string;
  calendarId?: string;
  selectedDays: string[];
  username: string;
  clerkUserId: string;
}) => {
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
    revalidatePath('/jv-elerhetoseg');
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }

};
