"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { clerkClient } from "@clerk/nextjs/server";
import { sendEmail } from "./sendEmail";

export type ApproveUserResult = {
  success: boolean;
  error?: string;
};

export async function approveUser(
  userId: string
): Promise<ApproveUserResult> {
  await connectDB();
  try {
    // Clerkben metaadatok frissítése
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        approved: true,
        approvedWelcomeShown: false,
        role: "user",
      },
    });

    const user = await clerk.users.getUser(userId);

    // Helyi adatbázisban user létrehozása, ha nem létezik
    let dbUser = await User.findOne({ clerkUserId: userId });
    if (!dbUser) {
      dbUser = await User.create({
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
        clerkUserId: userId,  
        username: `${user.lastName} ${user.firstName}`,
        image: user.imageUrl ?? undefined,
        address: { city: "", country: "Magyarország" },
        phoneNumber: "",
        hasTitle: "Nincs",
        status: "Nincs megadva",
        facebookUrl: "",
        instagramUrl: "",
      });
    }

    // Email küldés a usernek a jóváhagyásról
    await sendEmail({
      to: user.emailAddresses?.[0]?.emailAddress ?? "",
      type: "user-approved",
      username: `${user.lastName} ${user.firstName}`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
