"use server";

import connectDB from "@/config/database";
import Calendar from "@/models/Calendar";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchCalendars = async () => {
  await connectDB();
  try {
    const calendarsData = await Calendar.find().lean();
    if (!calendarsData) return null;
    const calendars = convertToJSON(calendarsData);
    return calendars;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
