"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function updatePassword({ newPassword, token }: { newPassword: string; token: string }) {
  await connectDB();
  const salt = await bcrypt.genSalt(8);
  const passwordHashed = await bcrypt.hash(newPassword, salt);

  const res = await User.findOneAndUpdate(
    { verifyToken: token },
    { password: passwordHashed }
  );

  if (res) redirect("/auth/belepes");
  return res;
}
