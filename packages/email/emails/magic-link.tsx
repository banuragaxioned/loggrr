import { Body, Container, Font, Head, Heading, Hr, Html, Link, Preview, Tailwind, Text } from "@react-email/components";

interface MagicLinkEmailProps {
  magicLink: string;
}

export const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => (
  <Html>
    <Tailwind>
      <Head>
        <Font
          fontFamily="Geist"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOMIlJna6VEdtaiLqoA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />

        <Font
          fontFamily="Geist"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RruMIlJna6VEdtaiLqoA.woff2",
            format: "woff2",
          }}
          fontWeight={500}
          fontStyle="normal"
        />
      </Head>
      <Preview>Log in to Loggrr with this magic link</Preview>
      <Body className="bg-[#fff] my-auto mx-auto font-sans">
        <Container className="max-w-lg my-[40px] p-[20px]">
          <Heading>Login to Loggrr</Heading>
          <Link href={magicLink} target="_blank" className="block text-[#121212] underline font-medium my-4">
            Click here to log in with this magic link
          </Link>
          <Text>Or, copy and paste this temporary login code:</Text>
          <code className="inline-block py-4 px-[4.5%] w-[90.5%] bg-[#f4f4f4] rounded-[5px] border border-[#eee] text-[#333]">
            {magicLink}
          </code>
          <Text className="text-[#666666]">
            If you didn&apos;t request this link, you can safely ignore this email.
          </Text>
          <Hr className="my-8" />
          <Link href="https://loggrr.com" className="text-sm text-[#b4becc]">
            Loggrr
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default MagicLinkEmail;
