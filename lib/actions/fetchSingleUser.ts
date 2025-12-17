"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { Result, User as UserType } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

/**
 * Fetches a single user by Clerk User ID
 * 
 * @param userId - The Clerk User ID
 * @returns Result<UserType> - On success returns the user, on error returns error message
 * 
 * @example
 * ```typescript
 * import { isSuccess, unwrapNullableResult } from "@/lib/utils/typeGuards";
 * 
 * const result = await fetchSingleUser(userId);
 * 
 * if (isSuccess(result)) {
 *   setProfile(result.data);
 * } else {
 *   toast.error(result.error);
 * }
 * ```
 */
export const fetchSingleUser = async (userId: string): Promise<Result<UserType>> => {
    return handleAsyncOperation(async () => {
        await connectDB();
        const user = await User.findOne({ clerkUserId: userId }).lean();
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return JSON.parse(JSON.stringify(user));
    }, 'Error fetching user');
};
