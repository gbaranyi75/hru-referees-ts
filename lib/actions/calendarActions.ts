"use server";

import connectDB from "@/config/database";
import Calendar from "@/models/Calendar";
import UserSelection from "@/models/Userselection";
import { Calendar as CalendarType } from "@/types/models";
import { ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Fetches calendars from the database
 */
export const fetchCalendars = async (): Promise<ActionResult<CalendarType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const calendarsData = await Calendar.find().lean();
    return JSON.parse(JSON.stringify(calendarsData));
  }, "Error fetching calendars");
};

export interface CalendarData {
  name: string;
  days: string[];
}

/**
 * Creates a new calendar in the database
 */
export const createNewCalendar = async (
  data: CalendarData
): Promise<ActionResult<null>> => {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const newCalendar = new Calendar({
      name: data.name,
      days: data.days,
    });
    await newCalendar.save();
    revalidatePath("/dashboard/calendar");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error creating calendar:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error creating calendar",
    };
  }
};

/**
 * Updates a calendar in the database
 */
export const updateCalendar = async (
  calendarId: string | undefined,
  data: CalendarData
): Promise<{ success: boolean; error: boolean } | Error> => {
  await connectDB();

  try {
    await Calendar.findOneAndUpdate(
      { _id: calendarId },
      { name: data.name, days: data.days }
    );
    revalidatePath("/dashboard/calendar");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

/**
 * Deletes a calendar from the database and all related user selections
 */
export const deleteCalendar = async (
  calendarId: string | undefined
): Promise<{ success: boolean; error: boolean } | Error> => {
  await connectDB();
  try {
    await Calendar.findByIdAndDelete(calendarId);
    await UserSelection.deleteMany({ calendarId: calendarId });
    revalidatePath("/dashboard/calendar");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
