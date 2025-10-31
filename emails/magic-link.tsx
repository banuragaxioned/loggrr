import { Button, Heading, Hr, Link, Preview, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface MagicLinkEmailProps {
  host?: string;
  magicLink?: string;
  expireMinutes?: number;
}

const MagicLinkEmail = ({
  host = "Loggrr",
  magicLink = "https://loggrr.com",
  expireMinutes = 5,
}: MagicLinkEmailProps) => {
  return (
    <>
      <Preview>Your secure magic link to sign in to {host}</Preview>
      <Tailwind>
        <div className="mx-auto my-auto bg-white px-2 font-sans">
          <div className="mx-auto my-8 max-w-[600px] p-4">
            <Section>
              <Heading className="mx-0 mb-0 mt-2 p-0 text-left text-3xl font-semibold text-black">
                Sign in to {host}
              </Heading>
              <Text className="text-base text-gray-700">Click on the button below to log in to your account.</Text>
              <Button
                href={magicLink}
                className="inline-block rounded-lg bg-black px-6 py-2 text-base text-white no-underline"
              >
                Sign in
              </Button>
              <Text className="text-sm text-gray-700">
                The magic link will expire in {expireMinutes} minutes. You can use this link to sign in to your account.
              </Text>
            </Section>

            <Hr className="mx-0 my-1 w-full border border-solid border-gray-200" />

            <Section>
              <Text className="text-sm text-gray-500">
                This email was sent by{" "}
                <Link href="https://loggrr.com" className="text-blue-600 underline">
                  Loggrr.com
                </Link>
                . If you did not request this email you can safely ignore it.
              </Text>
            </Section>
          </div>
        </div>
      </Tailwind>
    </>
  );
};

export default MagicLinkEmail;
