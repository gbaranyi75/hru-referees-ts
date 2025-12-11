"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { Result, UserSelection as UserSelectionType } from "@/types/types";

export const fetchUserSelections = async (calendarId: string | undefined): Promise<Result<UserSelectionType[]>> => {
  try {
    await connectDB();
    const userSelectionData = await UserSelection.find({
      calendarId: calendarId,
    }).lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(userSelectionData)) };
  } catch (error) {
    console.error('Error fetching user selections:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error fetching user selections'
    };
  }
};
