'use server'

import connectDB from "@/config/database";
import Calendar from "@/models/Calendar";
import UserSelection from "@/models/Userselection";
import { revalidatePath } from "next/cache";

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