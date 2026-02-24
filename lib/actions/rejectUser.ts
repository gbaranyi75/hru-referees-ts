"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { ActionResult } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { ErrorMessages, EmailSubjects } from "@/constants/messages";
import { sendEmail } from "./sendEmail";

/**
 * Rejects a user registration
 * 
 * Sends rejection email and deletes user from Clerk.
 * 
 * @param userId - The Clerk user ID to reject
 * @returns ActionResult<null> - Success or error result
 */
export async function rejectUser(userId: string): Promise<ActionResult<null>> {
  return handleAsyncOperation(async () => {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    await sendEmail({
      to: user.emailAddresses?.[0]?.emailAddress ?? "",
      type: "user-rejected",
      username: `${user.lastName} ${user.firstName}`,
      subject: EmailSubjects.REGISTRATION_REJECTED,
    });
    
    await clerk.users.deleteUser(userId);
    return null;
  }, ErrorMessages.USER.REJECTION_FAILED);
}
