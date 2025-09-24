import connectDB from "@/config/database";
import User from "@/models/User";
import { currentUser, clerkClient } from "@clerk/nextjs/server";


export const checkUser = async () => {
  await connectDB();
  try {
    const user = await currentUser();
    const clerk = await clerkClient(); // Get the ClerkClient instance
    const response = await clerk.users.getUserList();

    if (!user) return null;
    if (!user.publicMetadata.role) {
      await clerk.users.updateUserMetadata(user.id, {
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
      address: { city: '-', country: '-' },
      status: '-',
      facebookUrl: 'https://www.facebook.com/',
      instagramUrl: 'https://www.instagram.com/',
      phoneNumber: '0000-0000000000',
    });
    return newUser;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error)) as any;
  }
};
