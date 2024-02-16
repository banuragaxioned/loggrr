import * as React from "react";
import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from "@react-email/components";
import { Clock } from "lucide-react";

interface EmailProps {
  userFirstname: string;
}

const baseUrl = "https://loggr.dev";

export const Email = ({ userFirstname }: EmailProps) => (
  // <Html>
  //   <Head />
  // <Preview>The sales intelligence platform that helps you uncover qualified leads.</Preview>
  // <Body style={main}>
  <Container style={container}>
    <Section className="flex">
      <Clock className="h-6 w-6" />
      <span className="inline-block font-bold">Loggr</span>
    </Section>
    <Text style={paragraph}>Hi {userFirstname},</Text>
    <Text style={paragraph}>
      Welcome to Koala, the sales intelligence platform that helps you uncover qualified leads and close deals faster.
    </Text>
    <Section style={btnContainer}>
      <Button style={button} href="https://loggr.dev">
        Get started
      </Button>
    </Section>
    <Text style={paragraph}>
      Best,
      <br />
      The Koala team
    </Text>
    <Hr style={hr} />
    <Text style={footer}>470 Noor Ave STE B #1148, South San Francisco, CA 94080</Text>
  </Container>
  // {/* </Body> */}
  // </Html>
);

Email.PreviewProps = {
  userFirstname: "Alan",
} as EmailProps;

export default Email;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
