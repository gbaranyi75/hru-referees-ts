'use server'
import connectDB from "@/config/database";
import User from "@/models/User";
import { Result } from "@/types/types";
import { User as UserType } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

/**
 * Fetches users from the database
 * 
 * @returns Result<UserType[]> - On success returns array of users, on error returns error message
 * 
 * @example
 * ```typescript
 * import { isSuccess, unwrapArrayResult } from "@/lib/utils/typeGuards";
 * 
 * const result = await fetchUsers();
 * 
 * // Method 1: Using type guard
 * if (isSuccess(result)) {
 *   console.log(result.data); // TypeScript knows result.data is available
 * } else {
 *   console.error(result.error); // TypeScript knows result.error is available
 * }
 * 
 * // Method 2: Safe unwrapping
 * const users = unwrapArrayResult(result); // Always returns an array
 * ```
 */
export const fetchUsers = async (): Promise<Result<UserType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const users = await User.find().lean();
    return JSON.parse(JSON.stringify(users));
  }, 'Error fetching users');
};
