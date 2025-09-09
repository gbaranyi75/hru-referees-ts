"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { convertToJSON } from "../utils/convertToJSON";

export const fetchUserSelections = async (calendarId: string | undefined) => {
  await connectDB();
  try {    
    const userSelectionData = await UserSelection.find({
      calendarId: calendarId,
    }).lean();
    
    if (!userSelectionData) return null;
    
    const userSelection = convertToJSON(userSelectionData);
    
    return userSelection;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
