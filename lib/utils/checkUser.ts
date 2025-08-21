import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export const checkUser = async () => {
  await connectDB();
  try {
    const user = await currentUser();
    if (!user) return null;
    if (!user.publicMetadata.role) {
      await (
        await clerkClient()
      ).users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: "user",
        },
      });
    }

    const loggedInUser = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const newUser = await User.create({
      email: user.emailAddresses[0].emailAddress,
      clerkUserId: user.id,
      username: `${user.lastName} ${user.firstName}`,
      image: user.imageUrl,
    });
    return newUser;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error? error.message : String(error)) as any;
  }
};
