'use server'

import connectDB from "@/config/database";
import Calendar from "@/models/Calendar";
import UserSelection from "@/models/Userselection";
import { revalidatePath } from "next/cache";

/**
 * Deletes a calendar from the database and all related user selections
 * 
 * @param {string | undefined} calendarId - The calendar ID to delete
 * @returns {Promise<{success: boolean, error: boolean} | Error>} - On success returns success:true, on error returns Error object
 * @throws {Error} - If database error occurs
 * 
 * @example
 * const result = await deleteCalendar("cal123");
 * if (result.success) {
 *   console.log("Calendar and related selections successfully deleted");
 * }
 */
export const deleteCalendar = async (calendarId: string | undefined) => {
    await connectDB();
    try {
        const res = await Calendar.findByIdAndDelete(calendarId);
        const resp = await UserSelection.deleteMany({ calendarId: calendarId });
        revalidatePath("/dashboard/calendar");
        return { success: true, error: false };
    } catch (error) {
        console.error(error);
        return new Error(error instanceof Error ? error.message : String(error));
    }
};