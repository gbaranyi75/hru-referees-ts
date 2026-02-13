"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import type { User as ClerkUser } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/actions/sendEmail";
import { createNotification } from "@/lib/actions/notificationActions";
import { Result, User as UserType } from "@/types/types";

type NavbarData = {
  user: UserType | null;
  clerkUserId?: string;
};

/**
 * Aggregated navbar loader.
 *
 * Purpose:
 * - one place for Clerk auth resolution
 * - one place for first-login initialization / metadata sync
 * - one DB lookup for the navbar user payload
 * - optimized for the common case of logged-in users (DB lookup only for them, not for every visitor)
 */
export const fetchNavbarData = async (): Promise<Result<NavbarData>> => {
  try {
    await connectDB();

    const clerkUser = await currentUser().catch((err: unknown) => {
      console.error("Clerk currentUser error:", err);
      return null;
    });

    if (!clerkUser) {
      return { success: true, data: { user: null } };
    }

    // First-time user metadata initialization.
    if (!clerkUser.publicMetadata.role) {
      await initializeNewUser(clerkUser);
      return {
        success: true,
        data: { user: null, clerkUserId: clerkUser.id },
      };
    }

    // Mark welcome popup as already shown when approved.
    if (
      clerkUser.publicMetadata.approved === true &&
      clerkUser.publicMetadata.approvedWelcomeShown !== true
    ) {
      const clerk = await clerkClient();
      await clerk.users
        .updateUserMetadata(clerkUser.id, {
          publicMetadata: {
            ...clerkUser.publicMetadata,
            approvedWelcomeShown: true,
          },
        })
        .catch((err: unknown) => {
          console.error("Welcome metadata update error:", err);
        });
    }

    // For approved users fetch DB profile used by navbar.
    if (clerkUser.publicMetadata.approved === true) {
      const dbUser = await User.findOne({ clerkUserId: clerkUser.id }).lean().exec();

      return {
        success: true,
        data: {
          user: dbUser ? (JSON.parse(JSON.stringify(dbUser)) as UserType) : null,
          clerkUserId: clerkUser.id,
        },
      };
    }

    // Not approved users do not have a DB profile yet.
    return {
      success: true,
      data: { user: null, clerkUserId: clerkUser.id },
    };
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error fetching navbar data",
    };
  }
};

async function initializeNewUser(user: ClerkUser) {
  try {
    const clerk = await clerkClient();

    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "user",
        approved: false,
        approvedWelcomeShown: false,
      },
    });

    const { data: allUsers } = await clerk.users.getUserList();
    const adminUsers = allUsers.filter((u) => u.publicMetadata?.role === "admin");

    const adminEmails = adminUsers
      .map((u) => u.emailAddresses?.[0]?.emailAddress)
      .filter((email): email is string => Boolean(email));

    const nameParts = [user.lastName, user.firstName].filter(
      (part) => typeof part === "string" && part.trim(),
    ) as string[];

    const fullName = nameParts.join(" ") || "Unknown user";

    await Promise.allSettled([
      ...adminEmails.map((adminEmail) =>
        sendEmail({
          to: adminEmail,
          type: "admin-new-user",
          username: fullName,
          email: user.emailAddresses?.[0]?.emailAddress || "",
          subject:"Új regisztráció",
        }),
      ),
      ...adminUsers.map((admin) =>
        createNotification({
          recipientClerkUserId: admin.id,
          type: "new_registration",
          message: `Új regisztrációs kérelem érkezett: ${fullName}`,
        }),
      ),
    ]);
  } catch (error: unknown) {
    console.error("Error initializing new user:", error);
  }
}
