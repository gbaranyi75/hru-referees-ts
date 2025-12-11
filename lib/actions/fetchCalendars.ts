"use server";

import connectDB from "@/config/database";
import Calendar from "@/models/Calendar";
import { Result, Calendar as CalendarType } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

/**
 * Fetches calendars from the database
 * 
 * @returns Result<CalendarType[]> - On success returns array of calendars, on error returns error message
 * 
 * @example
 * ```typescript
 * import { isSuccess, unwrapArrayResult } from "@/lib/utils/typeGuards";
 * 
 * const result = await fetchCalendars();
 * 
 * if (isSuccess(result)) {
 *   const calendars = result.data.sort(...);
 * } else {
 *   console.error(result.error);
 * }
 * 
 * // Or safe unwrapping:
 * const calendars = unwrapArrayResult(result);
 * ```
 */
export const fetchCalendars = async (): Promise<Result<CalendarType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const calendarsData = await Calendar.find().lean();
    return JSON.parse(JSON.stringify(calendarsData));
  }, 'Error fetching calendars');
};
