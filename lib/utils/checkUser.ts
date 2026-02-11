import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/actions/sendEmail";
import { createNotification } from "@/lib/actions/notificationActions";
import type { User as ClerkUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  try {
    await connectDB();
    const user = await currentUser().catch((err: unknown) => {
      console.error("Clerk belső hiba (lehet Safari süti):", err);
      return null;
    });

    if (!user) return null;

    // === 1. FIRST-TIME REGISTRATION SETUP ===
    if (!user.publicMetadata.role) {
      await initializeNewUser(user);
      return null; // Approved false -> nincs DB user
    }

    // === 2. APPROVED USER WELCOME POPUP ===
    if (
      user.publicMetadata.approved === true &&
      user.publicMetadata.approvedWelcomeShown !== true
    ) {
      const clerk = await clerkClient();
      await clerk.users
        .updateUserMetadata(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            approvedWelcomeShown: true,
          },
        })
        .catch((err: unknown) => {
          console.error("Hiba a welcome popup frissítésekor:", err);
        });
    }

    // === 3. DB USER FETCH (csak approved usereknek) ===
    if (user.publicMetadata.approved === true) {
      const loggedInUser = await User.findOne({
        clerkUserId: user.id,
      })
        .lean() // Plain object, gyorsabb
        .exec();

      return loggedInUser ? JSON.parse(JSON.stringify(loggedInUser)) : null;
    }

    // Nem approved user -> nincs DB bejegyzés
    return null;
  } catch (error: unknown) {
    console.error("Hiba a checkUser funkcióban:", error);
    return null;
  }
};

// === HELPER: Új user inicializálás ===
async function initializeNewUser(user: ClerkUser) {
  try {
    const clerk = await clerkClient();

    // Metadata beállítás
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "user",
        approved: false,
        approvedWelcomeShown: false,
      },
    });

    // Admin értesítések
    const { data: allUsers } = await clerk.users.getUserList();
    const adminUsers = allUsers.filter(
      (u) => u.publicMetadata?.role === "admin",
    );

    const adminEmails = adminUsers
      .map((u) => u.emailAddresses?.[0]?.emailAddress)
      .filter((email): email is string => Boolean(email));

    const nameParts = [user.lastName, user.firstName].filter(
      (part) => typeof part === "string" && part.trim(),
    ) as string[];
    const fullName = nameParts.join(" ") || "Ismeretlen felhasználó";

    // Email + notification párhuzamosan
    await Promise.allSettled([
      ...adminEmails.map((adminEmail) =>
        sendEmail({
          to: adminEmail,
          type: "admin-new-user",
          username: fullName,
          email: user.emailAddresses?.[0]?.emailAddress || "",
          subject: "Új regisztráció",
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
    console.error("Hiba az új user inicializálásakor:", error);
    // Ne dobjunk hibát, hogy a checkUser ne bukjon el
  }
}
