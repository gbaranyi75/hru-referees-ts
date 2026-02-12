"use server";
import connectDB from "@/config/database";
import { currentUser } from "@clerk/nextjs/server";
import UserSelection from "@/models/Userselection";
import { revalidatePath } from "next/cache";

export const saveUserSelection = async (data: {
  calendarName: string;
  calendarId?: string;
  selectedDays: string[];
  username: string;
  clerkUserId: string;
}) => {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "Be kell jelentkezned a mentéshez!" };
  }

  try {
    // findOneAndUpdate: megkeresi, frissíti, ha nincs, létrehozza (upsert)
    const updatedSelection = await UserSelection.findOneAndUpdate(
      {
        clerkUserId: data.clerkUserId,
        calendarId: data.calendarId,
      },
      {
        $set: {
          selectedDays: data.selectedDays,
          username: data.username,
          calendarName: data.calendarName,
          // Itt frissíthetsz mást is, ha kell
        },
      },
      {
        upsert: true, // Ha nem találja, hozza létre
        new: true, // A frissített/létrehozott dokumentumot adja vissza
        setDefaultsOnInsert: true,
      },
    );

    revalidatePath("/jv-elerhetoseg");

    // Visszaadjuk az ID-t, hogy a frontend tudja tárolni
    return {
      success: true,
      selectionId: updatedSelection._id.toString(),
    };
  } catch (error) {
    console.error("Hiba a mentés során:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ismeretlen hiba",
    };
  }
};
