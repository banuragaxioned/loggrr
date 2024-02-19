import { Button, Column, Heading, Hr, Img, Link, Preview, Row, Section, Text } from "@react-email/components";

import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface EmailProps {
  username: string | null;
  userImage?: string;
  teamName: string;
  inviteLink: string;
  siteName: string;
}

export const Email = ({ username, userImage, teamName, inviteLink, siteName }: EmailProps) => {
  const previewText = `Welcome ${username} on ${teamName} workspace`;

  return (
    <>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <div key="email-body" className="mx-auto my-auto bg-white px-2 font-sans">
          <div className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              You joined <strong>{teamName}</strong> on <strong>{siteName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">Hi {username},</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              You just joined <strong>{teamName}</strong> workspace on <strong>{siteName}</strong>. Click on the link
              below to open your workspace.
            </Text>
            {userImage && (
              <Section>
                <Row>
                  <Column align="center">
                    <Img className="rounded-full" src={userImage} width="64" height="64" />
                  </Column>
                </Row>
              </Section>
            )}
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Go to Dashboard
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This message was intended for <span className="text-black">{username}</span>. This mail was sent from{" "}
              <span className="text-black">{siteName}</span>. If you were not expecting this mail, you can ignore this.
              If you are concerned about your account&apos;s safety, please reply to this email to get in touch with us.
            </Text>
          </div>
        </div>
      </Tailwind>
    </>
  );
};

export default Email;
