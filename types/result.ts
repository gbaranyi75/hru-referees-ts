export type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T;

export type Result<T> =
  | { success: true; data: Simplify<T> }
  | { success: false; error: string };

/**
 * Server Action response type
 * Unified type for all server actions to ensure consistency
 * @template T - The type of data returned on success
 */
export type ActionResult<T> = Result<T>;

export type CloudinaryUploadResult = {
  info: {
    secure_url: string;
    public_id: string;
  };
};
