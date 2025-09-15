"use server";
import connectDB from "@/config/database";
import Calendar from "@/models/Calendar";
import { revalidatePath } from "next/cache";

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
