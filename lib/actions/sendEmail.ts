"use server";

import React from "react";
import { Resend } from "resend";
import { ActionResult } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { ErrorMessages } from "@/constants/messages";
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

/**
 * Sends an email using the Resend service
 * 
 * @param params - Email parameters
 * @param params.to - Recipient email address
 * @param params.type - Email template type
 * @param params.subject - Email subject (optional)
 * @param params.username - Username for email content (optional)
 * @param params.email - Email for content (optional)
 * @returns ActionResult<null> - Success or error result
 */
export async function sendEmail(
  params: SendEmailParams
): Promise<ActionResult<null>> {
  return handleAsyncOperation(async () => {
    const { to, type, subject, username, email } = params;
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
        throw new Error(ErrorMessages.EMAIL.UNKNOWN_TYPE);
    }

    await resend.emails.send({
      from: "MRGSZ Játékvezetői Bizottság <info@hru-referees.hu>",
      to,
      subject: subject ?? "Értesítés",
      react: reactComponent,
    });

    return null;
  }, ErrorMessages.EMAIL.SEND_FAILED);
}
