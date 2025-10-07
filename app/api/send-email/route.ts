import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { Email } from "@/components/Email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, username, messageData, subject } = body;
        const { data, error } = await resend.emails.send({
            from: "MRGSZ Játékvezetői Bizottság <info@hru-referees.hu>",
            to: [email],
            subject: subject,
            react: Email({ username, messageData }) as React.ReactNode,
        });
        return NextResponse.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { message: "Email not sent", error: error },
            { status: 500 }
        );
    }
}