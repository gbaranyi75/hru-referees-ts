"use server";
import connectDB from "@/config/database";
import UserSelection from "@/models/Userselection";
import { revalidatePath } from "next/cache";

/**
 * Updates user calendar selection
 * 
 * @param {string | undefined} selectionId - The selection ID to update
 * @param {string[] | undefined} selectedDays - Array of new selected days
 * @returns {Promise<{success: boolean, error: boolean} | Error>} - On success returns success:true, on error returns Error object
 * @throws {Error} - If database error occurs
 * 
 * @example
 * const result = await updateUserSelection("sel123", ["2024-03-01", "2024-03-15", "2024-03-30"]);
 * if (result.success) {
 *   console.log("Selection successfully updated");
 * }
 */
export const updateUserSelection = async (selectionId: string | undefined, selectedDays: string[] | undefined) => {
  await connectDB();

  try {
    await UserSelection.findOneAndUpdate(
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
