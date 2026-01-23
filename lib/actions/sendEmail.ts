"use server";

import React from "react";
import { Resend } from "resend";
import AdminNewUserEmail from "@/components/emails/AdminNewUserEmail";
import UserApprovedEmail from "@/components/emails/UserApprovedEmail";
import UserRejectedEmail from "@/components/emails/UserRejectedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = "admin-new-user" | "user-approved" | "user-rejected";

interface SendEmailParams {
  to: string;
  type: EmailType;
  subject?: string;
  username?: string;
  email?: string;
}

export async function sendEmail({
  to,
  type,
  subject,
  username,
  email,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    let reactComponent: React.ReactElement;

    switch (type) {
      case "admin-new-user":
        reactComponent = React.createElement(AdminNewUserEmail, {
          username: username ?? "",
          email: email ?? "",
        });
        break;
      case "user-approved":
        reactComponent = React.createElement(UserApprovedEmail, {
          username: username ?? "",
        });
        break;
      case "user-rejected":
        reactComponent = React.createElement(UserRejectedEmail, {
          username: username ?? "",
        });
        break;
      default:
        throw new Error("Ismeretlen email típus");
    }

    await resend.emails.send({
      from: "MRGSZ Játékvezetői Bizottság <info@hru-referees.hu>",
      to,
      subject: subject ?? "Értesítés",
      react: reactComponent,
    });

    return { success: true };
  } catch (error) {
    console.error("Email küldési hiba:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
