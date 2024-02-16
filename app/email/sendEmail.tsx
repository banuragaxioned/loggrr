"use client";

import { render } from "@react-email/render";
import { Email } from "./email";
import { sendEmail } from "@/lib/email";

const emailHtml = render(<Email userFirstname="zishan" />);

const options = {
  to: "zishana@axioned.com",
  subject: "Hi, from Loggr",
  html: emailHtml,
};

const SendEmail = () => {
  return <button onClick={() => sendEmail(options)}>SendEmail</button>;
};

export default SendEmail;
