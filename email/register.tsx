import { Body, Container, Font, Head, Heading, Hr, Html, Link, Preview, Text } from "@react-email/components";
import * as React from "react";
import { Tailwind } from "@react-email/tailwind";

interface RegistrationEmailProps {
  name: string | null;
  siteName: string;
  siteUrl: string;
}

const RegistrationEmail = ({ name, siteName, siteUrl }: RegistrationEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />

          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
              format: "woff2",
            }}
            fontWeight={500}
            fontStyle="normal"
          />
        </Head>
        <Preview>Welcome to {siteName}</Preview>
        <Body className="mx-auto my-auto bg-[#fff] font-sans">
          <Container className="my-[40px] max-w-lg p-[20px]">
            <Heading>Welcome to Refreshly</Heading>
            <Text>Heya {name}</Text>
            <Text>
              We really apprecaite you joining us and we really believe you will be excited to see our refreshing take
              to give some of the regular chores a new twist.
            </Text>
            <Text>
              Our focus is mindfulness, more clarity and a better understanding of the things that matter to you, and
              for {siteName} to be there for you when you need it.
            </Text>
            <Text>
              Over the coming weeks, we will be rolling out invites and few more emails to help you understand what we
              have been working on. We are really excited to have you on board and we cannot wait to see what you think.
            </Text>
            <Text>
              Should you have any questions, please don&apos;t hesitate to reply directly to this email or to{" "}
              <Link href="https://cal.com/anuragbanerjee/30min" className="text-[#121212] underline">
                schedule a call with me
              </Link>
              .
            </Text>
            <Hr className="my-8" />
            <Link href={siteUrl} className="text-sm text-[#b4becc]">
              {siteName}
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RegistrationEmail;
