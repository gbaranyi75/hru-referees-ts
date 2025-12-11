'use server'
import connectDB from "@/config/database";
import GuestUser from "@/models/GuestUser";
import { Result, GuestUser as GuestUserType } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

/**
 * Fetches guest users from the database
 * 
 * @returns Result<GuestUserType[]> - On success returns array of guest users, on error returns error message
 * 
 * @example
 * ```typescript
 * import { isSuccess, unwrapArrayResult } from "@/lib/utils/typeGuards";
 * 
 * const result = await fetchGuestUsers();
 * 
 * if (isSuccess(result)) {
 *   setGuestUsers(result.data);
 * } else {
 *   toast.error(result.error);
 * }
 * 
 * // Or safe unwrapping:
 * const guestUsers = unwrapArrayResult(result);
 * ```
 */
export const fetchGuestUsers = async (): Promise<Result<GuestUserType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const users = await GuestUser.find().lean();
    return JSON.parse(JSON.stringify(users));
  }, 'Error fetching guest users');
};
