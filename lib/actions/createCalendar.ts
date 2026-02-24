"use server";
import connectDB from "@/config/database";
import { currentUser } from "@clerk/nextjs/server";
import Calendar from "@/models/Calendar";
import { revalidatePath } from "next/cache";
import { Result } from "@/types/result";

/**
 * Creates a new calendar in the database
 * 
 * @param {Object} data - Calendar data
 * @param {string} data.name - Calendar name
 * @param {Array<string>} data.days - Array of days for the calendar
 * @returns {Promise<Result<null>>} - On success {success: true, data: null}, on error {success: false, error: string}
 * 
 * @example
 * const result = await createNewCalendar({ name: "2024 Spring", days: ["2024-03-01", "2024-03-15"] });
 * if (result.success) {
 *   console.log("Calendar successfully created");
 * }
 */
export const createNewCalendar = async (data: { name: string; days: Array<string>; }): Promise<Result<null>> => {
  try {
    await connectDB();
    const user = await currentUser();
    
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }
    
    const newCalendar = new Calendar({
      name: data.name,
      days: data.days,
    });
    await newCalendar.save();
    revalidatePath('/dashboard/calendar');
    return { success: true, data: null };
  } catch (error) {
    console.error('Error creating calendar:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error creating calendar' 
    };
  }
};
