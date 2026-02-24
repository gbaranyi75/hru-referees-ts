/**
 * Type Guard functions for Result type
 * 
 * These functions help safely handle the Result<T> type,
 * which can be successful (success: true, data: T) or failed (success: false, error: string).
 * 
 * Usage:
 * ```typescript
 * const result = await fetchUsers();
 * if (isSuccess(result)) {
 *   // TypeScript knows that result.data is available
 *   console.log(result.data);
 * } else {
 *   // TypeScript knows that result.error is available
 *   console.error(result.error);
 * }
 * ```
 */

import { Result, Simplify } from "@/types/result";

/**
 * Checks if Result type is successful
 * @param result - The Result object to check
 * @returns true if successful (success: true), otherwise false
 */
export function isSuccess<T>(result: Result<T>): result is { success: true; data: Simplify<T> } {
  return result.success === true;
}

/**
 * Checks if Result type is failed
 * @param result - The Result object to check
 * @returns true if failed (success: false), otherwise false
 */
export function isError<T>(result: Result<T>): result is { success: false; error: string } {
  return result.success === false;
}

/**
 * Safely extracts data from a Result object
 * If successful, returns the data value, if failed, returns the default value
 * @param result - The Result object
 * @param defaultValue - Default value on error
 * @returns The data or the default value
 */
export function unwrapResultData<T>(result: Result<T>, defaultValue: T): T {
  return isSuccess(result) ? result.data : defaultValue;
}

/**
 * Safely extracts data from a Result<T[]> array
 * If successful, returns the data array, if failed, returns empty array
 * @param result - The Result<T[]> object
 * @returns The data array or empty array
 */
export function unwrapArrayResult<T>(result: Result<T[]>): T[] {
  return isSuccess(result) ? result.data : [];
}

/**
 * Safely extracts data from a Result<T | null> object
 * If successful, returns the data value, if failed, returns null
 * @param result - The Result<T | null> object
 * @returns The data or null
 */
export function unwrapNullableResult<T>(result: Result<T | null>): T | null {
  return isSuccess(result) ? result.data : null;
}
