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
    name: "JOHN",
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
    unplanned: "Unplanned Leave",
    planned: "Planned Leave",
    compoff: "Comp Off",
  };

  const totalLeavesTaken =
    +emailData.leaves.unplanned.taken + +emailData.leaves.planned.taken + +emailData.leaves.compoff.taken;
  const totalLeavesRemaining =
    +emailData.leaves.unplanned.remaining + +emailData.leaves.planned.remaining + +emailData.leaves.compoff.remaining;

  const leaveTypeRows = leaveTypes.map((leaveType) => {
    const eligible = (
      <span>
        Eligible:
        <span className="ml-1 text-base font-semibold text-[#201547]">{emailData.leaves[leaveType].eligible}</span>
      </span>
    );

    const taken = (
      <span>
        Taken:
        <span className="ml-1 text-base font-semibold text-[#201547]">{emailData.leaves[leaveType].taken}</span>
      </span>
    );

    const remaining = (
      <span>
        Remaining:
        <span className="ml-1 text-base font-semibold text-[#e31c79]">{emailData.leaves[leaveType].remaining}</span>
      </span>
    );

    return (
      <Row key={leaveType} className="mb-4 flex">
        <Column align="left">
          <Row>
            <Text className="m-0 text-left text-lg font-semibold text-black">{leaveTypeNames[leaveType]}</Text>
          </Row>
          <Row>
            <Text className="m-0 ml-2 text-left text-sm text-black/80">
              - {eligible} ︱ {taken} ︱ {remaining}
            </Text>
          </Row>
        </Column>
      </Row>
    );
  });

  return (
    <div>
      <Preview>Please Find {emailSubject}</Preview>
      <Tailwind>
        <div key="email-body" className="bg-white font-sans">
          {/* Heading */}
          <Section className="bg-[#201547] px-4 py-2">
            <Heading className="text-center text-[20px] font-normal text-white">{emailSubject}</Heading>
          </Section>
          <Section className="my-2 px-4">
            <Text className="text-base text-black">
              Hi <span className="font-bold capitalize">{emailData.name.toLowerCase()}</span>,
            </Text>
            <Text className="text-sm text-black">Please find the summary of your leaves below.</Text>
          </Section>
          {/* Total Leaves Summary */}
          <Section className="px-2">
            <Section className="bg-gray-100 p-4">
              <Text className="text-center text-lg font-semibold text-black">Total Leaves Summary</Text>
              <Row className="mb-4">
                <Column className="w-1/2 text-center">
                  <Text className="m-0 text-center text-[22px] font-bold text-[#201547]">{totalLeavesTaken}</Text>
                  <Text className="m-0 text-center text-base font-semibold uppercase text-black/80">Taken</Text>
                  <Text className="m-0 -mt-0.5 text-center text-xs text-black/50">(Total leaves used)</Text>
                </Column>
                <Column className="w-1/2 text-center">
                  <Text className="m-0 text-center text-[22px] font-bold text-[#e31c79]">{totalLeavesRemaining}</Text>
                  <Text className="m-0 text-center text-base font-semibold uppercase text-black/80">Remaining</Text>
                  <Text className="m-0 -mt-0.5 text-center text-xs text-black/50">(Available balance)</Text>
                </Column>
              </Row>
            </Section>
          </Section>
          {/* Leave Type Summary */}
          <Section className="my-6 px-4">{leaveTypeRows}</Section>
          {/* Footer */}
          <Hr />
          <Text className="px-4 text-center text-xs text-[#666666]">
            This message was intended for <span className="text-black">{emailData.name}</span> at{" "}
            <span className="text-black">Axioned</span>. If you were not expecting this mail, you can ignore this.
          </Text>
          <Hr />
        </div>
      </Tailwind>
    </div>
  );
};

export default LeavesEmail;
