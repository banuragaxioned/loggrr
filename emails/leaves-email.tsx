import { LeavesData } from "@/app/api/team/send-leaves/route";
import { Column, Heading, Hr, Preview, Row, Section, Text } from "@react-email/components";

import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface LeavesEmailProps {
  subject: string;
  data: LeavesData;
}

const DummyData = {
  subject: "Your Leaves Status till 18th July 2025",
  data: {
    name: "John",
    email: "zishana@axioned.com",
    leaves: {
      unplanned: { eligible: "10", taken: "5", remaining: "5" },
      planned: { eligible: "10", taken: "5", remaining: "5" },
      compoff: { eligible: "10", taken: "5", remaining: "5" },
    },
  },
};

const LeavesEmail = ({ subject, data }: LeavesEmailProps) => {
  // FALLBACK TO DUMMY DATA FOR TESTING PURPOSES
  const emailSubject = subject || DummyData.subject;
  const emailData = data || DummyData.data;

  const leaveTypes = Object.keys(emailData.leaves) as (keyof LeavesData["leaves"])[];
  const leaveTypeNames = {
    unplanned: "Unplanned",
    planned: "Planned",
    compoff: "Comp Off",
  };

  const headerRow = (
    <Row className="bg-gray-300">
      <Column align="left" className="w-1/4 px-4 py-2 text-sm font-bold uppercase tracking-wide text-gray-800">
        Leave Type
      </Column>
      <Column align="center" className="w-1/4 py-2 text-sm font-bold uppercase tracking-wide text-gray-800">
        Eligible
      </Column>
      <Column align="center" className="w-1/4 py-2 text-sm font-bold uppercase tracking-wide text-gray-800">
        Taken
      </Column>
      <Column align="center" className="w-1/4 py-2 text-sm font-bold uppercase tracking-wide text-gray-800">
        Remaining
      </Column>
    </Row>
  );

  const leaveTypeRows = leaveTypes.map((leaveType, index) => {
    const isEvenRow = index % 2 === 0;

    return (
      <Row key={leaveType} className={`${isEvenRow ? "bg-white" : "bg-gray-50"}`}>
        <Column align="left" className="w-1/4 px-4 py-2 text-sm text-gray-800">
          {leaveTypeNames[leaveType]}
        </Column>
        <Column align="center" className="w-1/4 py-2 text-sm text-gray-600">
          {emailData.leaves[leaveType].eligible}
        </Column>
        <Column align="center" className="w-1/4 py-2 text-sm text-gray-600">
          {emailData.leaves[leaveType].taken}
        </Column>
        <Column align="center" className="w-1/4 py-2 text-sm text-gray-600">
          {emailData.leaves[leaveType].remaining}
        </Column>
      </Row>
    );
  });

  return (
    <>
      <Preview>Please Find {emailSubject}</Preview>
      <Tailwind>
        <div key="email-body" className="bg-white p-4 font-sans">
          <div className="mx-auto rounded border border-solid border-[#eaeaea]">
            <Section className="px-4">
              <Heading className="text-center text-[24px] font-normal text-black">{emailSubject}</Heading>
              <Hr />
              <Section className="mt-6">
                <Text className="text-[16px] leading-[24px] text-black">Hi {emailData.name},</Text>
                <Text className="text-[14px] leading-[24px] text-black">
                  Please find the summary of your leaves below
                </Text>
              </Section>
            </Section>
            <Section className="my-6">
              {headerRow}
              {leaveTypeRows}
            </Section>
            <Section className="px-4 text-right">
              <span className="text-lg text-gray-600">Total Leaves</span>
            </Section>
            <Section className="px-4 text-right">
              <span className="text-sm text-gray-600">
                Taken -{" "}
                {+emailData.leaves.unplanned.taken + +emailData.leaves.planned.taken + +emailData.leaves.compoff.taken}
              </span>
            </Section>
            <Section className="px-4 text-right">
              <span className="text-sm text-gray-600">
                Remaining -{" "}
                {+emailData.leaves.unplanned.remaining +
                  +emailData.leaves.planned.remaining +
                  +emailData.leaves.compoff.remaining}
              </span>
            </Section>
            <Hr />
            <Text className="px-4 text-center text-[12px] leading-[24px] text-[#666666]">
              This message was intended for <span className="text-black">{emailData.name}</span> at{" "}
              <span className="text-black">Axioned</span>. If you were not expecting this mail, you can ignore this.
            </Text>
          </div>
        </div>
      </Tailwind>
    </>
  );
};

export default LeavesEmail;
