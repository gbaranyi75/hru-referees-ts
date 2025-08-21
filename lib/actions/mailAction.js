"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function mailAction({ email, domain }) {
  await connectDB();
  const result = await User.findOne({ email });
  if (result) {
    const token = nanoid(32);
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });
    console.log("Token ", token);
    const htmlBody = `Kattints ide a jelszó  helyreállításához! <a href="${domain}/jelszo-helyreallitas/${token}"> Jelszó helyreállítása</a>`;
    const message = {
      from: '"HRU Referees" <bgabor91@gmail.com>',
      to: email,
      subject: "Jelszó helyreállítás",
      text: "Új jelszó",
      html: htmlBody,
    };

    const info = await transporter.sendMail(message);
    console.log(info.accepted, info.response);
    console.log(info.response);

    if (info.accepted) {
      await User.findOneAndUpdate(
        { email: email },
        { verifyToken: token }
      );
    }

    return info.accepted;
  } else {
    console.log("user does not exist", result);
    return result;
  }
}
