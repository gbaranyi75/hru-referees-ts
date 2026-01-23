import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/actions/sendEmail";
import { createNotification } from "@/lib/actions/notificationActions";

export const checkUser = async () => {
  await connectDB();
  try {
    const user = await currentUser();

    if (!user) return null;

    // Ez a rész az első bejelentkezéskor lefut, hogy beállítsa a metaadatokat.
    // Csak akkor fut le, ha a felhasználónak még nincs szerepköre a Clerkben.
    if (!user.publicMetadata.role) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: "user",
          approved: false,
          approvedWelcomeShown: false,
        },
      });

      // Admin email-címek és Clerk user ID-k lekérése
      const { data: allUsers } = await clerk.users.getUserList();
      const adminUsers = allUsers.filter(
        (u) =>
          u.publicMetadata &&
          typeof u.publicMetadata === "object" &&
          u.publicMetadata.role === "admin"
      );
      const adminEmails = adminUsers
        .map((u) => u.emailAddresses?.[0]?.emailAddress)
        .filter(Boolean);

      // Email küldés minden adminnak
      await Promise.all(
        adminEmails.map((adminEmail) =>
          sendEmail({
            to: adminEmail,
            type: "admin-new-user",
            username: `${user.lastName} ${user.firstName}` || "",
            email: user.emailAddresses?.[0]?.emailAddress || "",
            subject: "Új regisztráció",
          })
        )
      );

      // In-app notification minden adminnak
      await Promise.all(
        adminUsers.map((admin) =>
          createNotification({
            recipientClerkUserId: admin.id,
            type: "new_registration",
            message: `Új regisztrációs kérelem érkezett: ...`,
          })
        )
      );
    }

    // Ellenőrizzük, hogy a felhasználó létezik-e a helyi adatbázisunkban a Clerk ID alapján.
    const loggedInUser = await User.findOne({
      clerkUserId: user.id,
    });

    // Ha a user approved és van loggedInUser, állítsuk be a welcome popupot true-ra (ha még nem az)
    if (
      user.publicMetadata.approved === true &&
      loggedInUser &&
      user.publicMetadata.approvedWelcomeShown !== true
    ) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          approvedWelcomeShown: true,
        },
      });
    }

    // Visszaadjuk a felhasználót, ha megtaláltuk, egyébként null-t.
    return loggedInUser;
  } catch (error) {
    console.error("Hiba a checkUser funkcióban:", error);
    return null;
  }
};
