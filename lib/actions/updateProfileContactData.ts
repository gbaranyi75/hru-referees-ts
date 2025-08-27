"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Address } from "@/types/types";

export const updateProfileContactData = async (
  address: Address,
  status: string,
  phoneNumber: string
) => {
  await connectDB();
  try {
    const user = await currentUser();
    await User.findOneAndUpdate(
      { email: user?.emailAddresses[0].emailAddress },
      { status: status, address: address, phoneNumber: phoneNumber },
    );
    revalidatePath("/profil");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
