import type { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import WelcomeTemplate from "@/emails/welcomeTemplate";
import { sendEmail } from "@/lib/email";
import VercelInviteUserEmail from "@/emails/userInvite";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sendEmail({
    to: "vipiny@axioned.com",
    subject: "Invited to Loggr",
    html: render(
      VercelInviteUserEmail({
        username: "anurag",
        invitedByEmail: "anurag@axioned.com",
        inviteFromLocation: "India",
        invitedByUsername: "Ankita",
        teamName: "Axioned",
        inviteFromIp: "192.168.0.1",
        inviteLink: "https://loggr-app.vercel.app",
        teamImage: "https://loggr-app.vercel.app/images/axioned.png",
        userImage: "https://loggr-app.vercel.app/images/axioned.png",
      })
    ),
  });

  return res.status(200).json({ message: "Email sent successfully" });
}
