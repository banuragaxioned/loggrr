"use server";

import nodemailer from "nodemailer";
import { env } from "@/env.mjs";
import { render } from "@react-email/render";

interface EmailPayload {
  to: string;
  subject: string;
  html: JSX.Element;
}

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
  from: env.EMAIL_FROM,
});

export async function sendEmail(payload: EmailPayload) {
  try {
    const htmlContent = render(payload.html);

    await transporter.sendMail({
      ...payload,
      html: await htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
