"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { convertToJSON } from "../utils/convertToJSON";
import { currentUser } from "@clerk/nextjs/server";

export const fetchUserSelection = async (calendarId: string | undefined) => {
  await connectDB();
  try {
    const user = await currentUser();

    if (!user) return null;
    
    const userSelectionData = await UserSelection.findOne({
      calendarId: calendarId,
      clerkUserId: user.id,
    }).lean();
    
    if (!userSelectionData) return null;
    
    const userSelection = convertToJSON(userSelectionData);
    
    return userSelection;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
