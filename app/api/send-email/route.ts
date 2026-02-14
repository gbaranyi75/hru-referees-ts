import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { RefereeNotificationEmail } from "@/components/emails/RefereeNotificationEmail";
import { ContactMessageEmail } from "@/components/emails/ContactMessageEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Új kapcsolatfelvételi üzenet kezelése
    if (body.contactForm) {
      const { name, email, message } = body.contactForm;
      const { error } = await resend.emails.send({
        from: `Kapcsolatfelvétel <info@hru-referees.hu>`,
        to: [process.env.CONTACT_EMAIL || "rugbyreferre.hungary@gmail.com"],
        subject: "Új kapcsolatfelvételi üzenet",
        react: ContactMessageEmail({ name, email, message }) as React.ReactNode,
      });
      if (error) {
        return NextResponse.json(
          { message: "Kapcsolatfelvételi email nem küldhető", error },
          { status: 500 },
        );
      }
      return NextResponse.json({
        message: "Kapcsolatfelvételi email sikeresen elküldve",
      });
    }
    // Régi funkció: játékvezetői értesítés
    const { email, username, messageData, subject } = body;
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
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Email not sent", error: error },
      { status: 500 },
    );
  }
}
