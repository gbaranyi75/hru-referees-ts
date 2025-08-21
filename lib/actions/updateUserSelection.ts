"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";

export const updateUserSelection = async (selectionId: string, selectedDays: string[]) => {
  await connectDB();

  try {
    const res = await UserSelection.findOneAndUpdate(
      { _id: selectionId },
      { selectedDays: selectedDays }
    );
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
