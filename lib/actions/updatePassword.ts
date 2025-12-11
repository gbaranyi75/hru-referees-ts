"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcrypt";

/**
 * Updates user password based on token
 * 
 * @param {Object} params - The password update parameters
 * @param {string} params.newPassword - The new password
 * @param {string} params.token - The password reset token
 * @returns {Promise<any>} - The updated User document or null
 * @throws {Error} - If database error occurs
 * 
 * @example
 * const result = await updatePassword({
 *   newPassword: "newPassword123",
 *   token: "reset_token_abc123"
 * });
 * if (result) {
 *   console.log("Password successfully updated");
 * }
 */
export async function updatePassword({ newPassword, token }: { newPassword: string; token: string }) {
  await connectDB();
  const salt = await bcrypt.genSalt(8);
  const passwordHashed = await bcrypt.hash(newPassword, salt);

  const res = await User.findOneAndUpdate(
    { verifyToken: token },
    { password: passwordHashed }
  );

  //if (res) redirect("/auth/belepes");
  return res;
}
