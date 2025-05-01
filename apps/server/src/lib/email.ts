import nodemailer from "nodemailer";

// Configure transporter for AWS SES SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  port: 587, // Use 465 for SSL, 587 for TLS
  secure: false, // Set to true if using port 465
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
  },
});

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    text,
    html,
  });
}
