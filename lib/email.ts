"use server";

import type { ReactElement } from "react";
import { SMTPClient } from "emailjs";
import { env } from "@/env.mjs";
import { render } from "@react-email/render";

interface EmailPayload {
  to: string;
  subject: string;
  html: ReactElement;
}

export async function sendEmail(payload: EmailPayload) {
  const port = Number(env.EMAIL_PORT);
  const client = new SMTPClient({
    host: env.EMAIL_HOST,
    port,
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
    ssl: port === 465,
    tls: port !== 465,
    timeout: 15_000,
  });
  try {
    const htmlContent = await render(payload.html);

    await client.sendAsync({
      to: payload.to,
      subject: payload.subject,
      from: env.EMAIL_FROM,
      attachment: [{ data: htmlContent, alternative: true }],
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  } finally {
    client.smtp.close();
  }
}
