import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Returns the currently logged in user and their Clerk user ID.
 * If no user is logged in, returns an object with `user` and `userId` set to `undefined`.
 * @returns {Promise<{user: User, userId: string}>}
 * @throws {Error}
 */
export const getSessionUser = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      console.log('No logged in user right now');
    }

    return {
      user: user,
      userId: userId,
    };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error)) as any;
  }
};
