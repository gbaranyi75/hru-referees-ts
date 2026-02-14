import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { RefereeNotificationEmail } from "@/components/emails/RefereeNotificationEmail";
import { ContactMessageEmail } from "@/components/emails/ContactMessageEmail";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting konstansok
const RATE_LIMIT = {
  MAX_REQUESTS: 5, // Maximum 5 üzenet
  WINDOW_MS: 60 * 60 * 1000, // 1 óra alatt
};

// In-memory rate limiter store
const rateLimitStore: Map<
  string,
  { count: number; resetTime: number }
> = new Map();

// Rate limit ellenőrző függvény
function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Ha nincs rekord vagy lejárt az időablak
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    });
    return { allowed: true };
  }

  // Kérések száma már elérte a limitet
  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    const resetDate = new Date(record.resetTime);
    return {
      allowed: false,
      message: `Túl sok üzenet küldési kísérlet. Kérlek, próbáld később ${resetDate.getHours()}:${String(resetDate.getMinutes()).padStart(2, "0")}-kor.`,
    };
  }

  // Erhöhe die Anzahl der Anfragen
  record.count += 1;
  return { allowed: true };
}

// Validációs konstansok
const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MIN: 5,
  EMAIL_MAX: 255,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Email formátum validáló függvény
function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

// Input validáló függvény
function validateContactFormInput(
  name: string,
  email: string,
  message: string,
): string | null {
  // Name validáció
  const trimmedName = name.trim();
  if (!trimmedName) {
    return "A név megadása kötelező";
  }
  if (trimmedName.length < VALIDATION.NAME_MIN) {
    return `A név legalább ${VALIDATION.NAME_MIN} karakterből kell, hogy álljon`;
  }
  if (trimmedName.length > VALIDATION.NAME_MAX) {
    return `A név maximum ${VALIDATION.NAME_MAX} karakterből állhat`;
  }

  // Email validáció
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return "Az email cím megadása kötelező";
  }
  if (
    trimmedEmail.length < VALIDATION.EMAIL_MIN ||
    trimmedEmail.length > VALIDATION.EMAIL_MAX
  ) {
    return "Az email cím érvénytelen";
  }
  if (!isValidEmail(trimmedEmail)) {
    return "Az email cím formátuma érvénytelen";
  }

  // Message validáció
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    return "Az üzenet megadása kötelező";
  }
  if (trimmedMessage.length < VALIDATION.MESSAGE_MIN) {
    return `Az üzenet legalább ${VALIDATION.MESSAGE_MIN} karakterből kell, hogy álljon`;
  }
  if (trimmedMessage.length > VALIDATION.MESSAGE_MAX) {
    return `Az üzenet maximum ${VALIDATION.MESSAGE_MAX} karakterből állhat`;
  }

  return null; // Nincs hiba
}

export async function POST(request: NextRequest) {
  try {
    // IP cím kinyerése
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const body = await request.json();
    // Új kapcsolatfelvételi üzenet kezelése
    if (body.contactForm) {
      // Rate limit ellenőrzés
      const rateLimitCheck = checkRateLimit(ip);
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          { error: rateLimitCheck.message },
          { status: 429 }, // Too Many Requests
        );
      }

      const { name, email, message } = body.contactForm;

      // Input validáció
      const validationError = validateContactFormInput(name, email, message);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      // Trimelt értékek használata
      const sanitizedData = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      };

      const { error } = await resend.emails.send({
        from: `Kapcsolatfelvétel <info@hru-referees.hu>`,
        to: "rugbyreferee.hungary@gmail.com",
        subject: "Új kapcsolatfelvételi üzenet",
        react: ContactMessageEmail(sanitizedData) as React.ReactNode,
      });
      if (error) {
        console.error("Email küldési hiba:", error);
        return NextResponse.json(
          {
            error: "Az email küldése sikertelen. Kérlek, próbáld később!",
          },
          { status: 500 },
        );
      }
      return NextResponse.json(
        { success: true, message: "Üzenet sikeresen elküldve!" },
        { status: 200 },
      );
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
    console.error("Hiba az email küldésekor:", error);
    return NextResponse.json(
      { error: "Szerver hiba történt. Kérlek, próbáld később!" },
      { status: 500 },
    );
  }
}
