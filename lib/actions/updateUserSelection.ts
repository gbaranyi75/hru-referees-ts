"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { revalidatePath } from "next/cache";

export const updateUserSelection = async (selectionId: string | undefined, selectedDays: string[] | undefined) => {
  await connectDB();

  try {
    const res = await UserSelection.findOneAndUpdate(
      { _id: selectionId },
      { selectedDays: selectedDays }
    );
    revalidatePath('/jv-elerhetoseg');
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
