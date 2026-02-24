"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { clerkClient } from "@clerk/nextjs/server";
import { ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { ErrorMessages, SuccessMessages } from "@/constants/messages";
import { sendEmail } from "./sendEmail";

/**
 * Approves a user registration
 * 
 * Updates user metadata in Clerk and creates user record in database,
 * then sends approval email.
 * 
 * @param userId - The Clerk user ID to approve
 * @returns ActionResult<null> - Success or error result
 */
export async function approveUser(userId: string): Promise<ActionResult<null>> {
  return handleAsyncOperation(async () => {
    await connectDB();

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
    const emailResult = await sendEmail({
      to: user.emailAddresses?.[0]?.emailAddress ?? "",
      type: "user-approved",
      username: `${user.lastName} ${user.firstName}`,
    });

    if (!emailResult.success) {
      console.warn("Email sending failed, but user was approved:", emailResult.error);
    }

    return null;
  }, ErrorMessages.USER.APPROVAL_FAILED);
}
