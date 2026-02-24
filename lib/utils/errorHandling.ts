/**
 * Central error handling utility
 * 
 * Provides unified error handling for the application. All server actions
 * should use these functions to return ActionResult (Result) type.
 * 
 * This ensures:
 * - Consistent error handling across the application
 * - Type-safe error responses
 * - Clear distinction between success and failure states
 * 
 * Usage:
 * ```typescript
 * import { handleAsyncOperation } from "@/lib/utils/errorHandling";
 * import { ActionResult } from "@/types/models";
 * 
 * export const fetchUsers = async (): Promise<ActionResult<User[]>> => {
 *   return handleAsyncOperation(async () => {
 *     await connectDB();
 *     const users = await User.find().lean();
 *     return JSON.parse(JSON.stringify(users));
 *   }, 'Error fetching users');
 * };
 * ```
 */

import { ActionResult, Simplify } from "@/types/result";

/**
 * Handles async operations with ActionResult type
 * 
 * Wraps async operations to catch errors and return a consistent Result format.
 * Automatically serializes Mongoose documents to plain objects.
 * 
 * @template T - The type of data returned on success
 * @param operation - The async operation that returns data of type T
 * @param errorMessage - Custom error message (optional). If not provided, uses error.message
 * @returns ActionResult<T> - { success: true, data: T } or { success: false, error: string }
 * 
 * @example
 * ```typescript
 * export const fetchTeams = async (): Promise<ActionResult<Team[]>> => {
 *   return handleAsyncOperation(async () => {
 *     await connectDB();
 *     const teams = await Team.find().lean();
 *     return JSON.parse(JSON.stringify(teams));
 *   });
 * };
 * ```
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<ActionResult<T>> {
  try {
    const data = await operation();
    return { success: true, data: data as Simplify<T> };
  } catch (error) {
    console.error('Async operation error:', error);
    const message = errorMessage || 
      (error instanceof Error ? error.message : 'Unknown error occurred');
    return { success: false, error: message };
  }
}

/**
 * Handles sync operations with ActionResult type
 * 
 * Wraps sync operations to catch errors and return a consistent Result format.
 * 
 * @template T - The type of data returned on success
 * @param operation - The sync operation that returns data of type T
 * @param errorMessage - Custom error message (optional)
 * @returns ActionResult<T> - { success: true, data: T } or { success: false, error: string }
 */
export function handleSyncOperation<T>(
  operation: () => T,
  errorMessage?: string
): ActionResult<T> {
  try {
    const data = operation();
    return { success: true, data: data as Simplify<T> };
  } catch (error) {
    console.error('Sync operation error:', error);
    const message = errorMessage || 
      (error instanceof Error ? error.message : 'Unknown error occurred');
    return { success: false, error: message };
  }
}

/**
 * Formats error message in user-friendly format
 * 
 * @param error - The error object
 * @param defaultMessage - Default error message
 * @returns Formatted error message
 */
export function formatErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}

/**
 * Creates ActionResult object from success
 * 
 * @template T - The type of data
 * @param data - The data to return
 * @returns Successful ActionResult object
 */
export function createSuccessResult<T>(data: T): ActionResult<T> {
  return { success: true, data: data as Simplify<T> };
}

/**
 * Creates ActionResult object from error
 * 
 * @template T - The type of data (unused in error case)
 * @param error - The error message or object
 * @param defaultMessage - Default error message
 * @returns Failed ActionResult object
 */
export function createErrorResult<T>(error: unknown, defaultMessage?: string): ActionResult<T> {
  const message = formatErrorMessage(
    error, 
    defaultMessage || 'Error occurred during operation'
  );
  return { success: false, error: message };
}
