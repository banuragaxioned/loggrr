import nodemailer from "nodemailer"

type EmailPayload = {
  to: string
  subject: string
  html: string
}

// Replace with your SMTP credentials
const smtpOptions = {
  host: process.env.EMAIL_HOST|| "smtp.mailtrap.io",
  port: parseInt(process.env.EMAIL_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "user",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
}

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  })

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    ...data,
  })
}
