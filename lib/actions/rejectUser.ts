"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { sendEmail } from "./sendEmail";

export type RejectUserResult = {
  success: boolean;
  error?: string;
};

export async function rejectUser(userId: string): Promise<RejectUserResult> {
  try {
    console.log(userId)
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    await sendEmail({
      to: user.emailAddresses?.[0]?.emailAddress ?? "",
      type: "user-rejected",
      username: `${user.lastName} ${user.firstName}`,
    });
    await clerk.users.deleteUser(userId);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
