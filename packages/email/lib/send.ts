"use server";

import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { env } from "../env";
import { JSX } from "react";

interface SendEmailProps {
  to: string;
  subject: string;
  html: JSX.Element;
}

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(payload: SendEmailProps) {
  try {
    const emailHtml = render(payload.html);

    await transporter.sendMail({
      ...payload,
      from: env.EMAIL_FROM,
      html: await emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
