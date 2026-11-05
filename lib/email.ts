"use server";

import type { ReactElement } from "react";
import { createMailTransport } from "@/lib/smtp";
import { env } from "@/env.mjs";
import { render } from "@react-email/render";

interface EmailPayload {
  to: string;
  subject: string;
  html: ReactElement;
}

export async function sendEmail(payload: EmailPayload) {
  const transporter = createMailTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASSWORD },
  });
  try {
    const htmlContent = await render(payload.html);

    await transporter.sendMail({
      ...payload,
      from: env.EMAIL_FROM,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  } finally {
    transporter.close();
  }
}
