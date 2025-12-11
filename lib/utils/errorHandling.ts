/**
 * Central error handling utility
 * 
 * Provides unified error handling for the application. All fetch operations
 * can use these functions to return Result type.
 * 
 * Usage:
 * ```typescript
 * export const fetchUsers = async (): Promise<Result<User[]>> => {
 *   return handleAsyncOperation(async () => {
 *     await connectDB();
 *     const users = await User.find().lean();
 *     return JSON.parse(JSON.stringify(users));
 *   }, 'Error fetching users');
 * };
 * ```
 */

import { Result } from "@/types/types";

/**
 * Handles async operations with Result type
 * 
 * @param operation - The async operation that returns data of type T
 * @param errorMessage - Custom error message (optional)
 * @returns Result<T> object with success or error
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error('Async operation error:', error);
    const message = errorMessage || 
      (error instanceof Error ? error.message : 'Unknown error occurred');
    return { success: false, error: message };
  }
}

/**
 * Handles sync operations with Result type
 * 
 * @param operation - The sync operation that returns data of type T
 * @param errorMessage - Custom error message (optional)
 * @returns Result<T> object with success or error
 */
export function handleSyncOperation<T>(
  operation: () => T,
  errorMessage?: string
): Result<T> {
  try {
    const data = operation();
    return { success: true, data };
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
 * Creates Result object from success
 * 
 * @param data - The data to return
 * @returns Successful Result object
 */
export function createSuccessResult<T>(data: T): Result<T> {
  return { success: true, data };
}

/**
 * Creates Result object from error
 * 
 * @param error - The error message or object
 * @param defaultMessage - Default error message
 * @returns Failed Result object
 */
export function createErrorResult<T>(error: unknown, defaultMessage?: string): Result<T> {
  const message = formatErrorMessage(
    error, 
    defaultMessage || 'Error occurred during operation'
  );
  return { success: false, error: message };
}
