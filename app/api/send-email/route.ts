import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { RefereeNotificationEmail } from "@/components/emails/RefereeNotificationEmail";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

// Játékvezetői értesítés email küldése
// Ez az endpoint csak hitelesített felhasználók számára elérhető (Clerk auth szükséges)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, messageData, subject } = body;

    // Alapvető validáció
    if (!email || !username || !messageData || !subject) {
      return NextResponse.json(
        { error: "Hiányzó kötelező mezők" },
        { status: 400 },
      );
    }

    const { error } = await resend.emails.send({
      from: "MRGSZ Játékvezetői Bizottság <info@hru-referees.hu>",
      to: [email],
      subject: subject,
      react: RefereeNotificationEmail({
        username,
        messageData,
      }) as React.ReactNode,
    });
    if (error) {
      return NextResponse.json(
        { message: "Email not sent", error },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Hiba az email küldésekor:", error);
    return NextResponse.json(
      { error: "Szerver hiba történt. Kérlek, próbáld később!" },
      { status: 500 },
    );
  }
}
