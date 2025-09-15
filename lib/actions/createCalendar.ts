"use server";
import connectDB from "@/config/database";
import { currentUser } from "@clerk/nextjs/server";
import Calendar from "@/models/Calendar";
import { revalidatePath } from "next/cache";

export const createNewCalendar = async (data: { name: string; days: Array<string>; }) => {
  await connectDB();
  const user = await currentUser();
  try {
    if (!user) {
      return { error: "You must be logged in to create a calendar" };
    }
    const newCalendar = new Calendar({
      name: data.name,
      days: data.days,
    });
    await newCalendar.save();
    revalidatePath('/dashboard/calendar');
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
