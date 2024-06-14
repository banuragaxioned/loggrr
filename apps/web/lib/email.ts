"use server";

import nodemailer from "nodemailer";
import { env } from "@/env.mjs";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// Replace with your SMTP credentials
const smtpOptions = {
  host: env.EMAIL_HOST || "smtp.mailtrap.io",
  port: parseInt(env.EMAIL_PORT || "2525"),
  secure: false,
  auth: {
    user: env.EMAIL_USER || "user",
    pass: env.EMAIL_PASSWORD || "password",
  },
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    from: env.EMAIL_FROM,
    ...data,
  });
};
