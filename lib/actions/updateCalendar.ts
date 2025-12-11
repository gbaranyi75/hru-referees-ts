"use server";
import connectDB from "@/config/database";
import Calendar from "@/models/Calendar";
import { revalidatePath } from "next/cache";

/**
 * Updates a calendar in the database
 * 
 * @param {string | undefined} calendarId - The calendar ID to update
 * @param {Object} data - The new calendar data
 * @param {string} data.name - The new calendar name
 * @param {string[]} data.days - The new array of days
 * @returns {Promise<{success: boolean, error: boolean} | Error>} - On success returns success:true, on error returns Error object
 * @throws {Error} - If database error occurs
 * 
 * @example
 * const result = await updateCalendar("cal123", {
 *   name: "2024 Spring - updated",
 *   days: ["2024-03-01", "2024-03-15", "2024-03-30"]
 * });
 * if (result.success) {
 *   console.log("Calendar successfully updated");
 * }
 */
export const updateCalendar = async (calendarId: string | undefined, data: { name: string, days: string[] }) => {
  await connectDB();

  try {
    await Calendar.findOneAndUpdate(
      { _id: calendarId },
      { name: data.name, days: data.days }
    );
    revalidatePath('/dashboard/calendar');
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
