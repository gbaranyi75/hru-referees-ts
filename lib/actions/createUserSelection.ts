"use server";
import connectDB from "@/config/database";
import { currentUser } from "@clerk/nextjs/server";
import UserSelection from "@/models/Userselection";
import { revalidatePath } from "next/cache";

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
