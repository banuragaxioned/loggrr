"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import { Stock } from "@/components/ai/stock";
import { TimeEntries } from "@/components/ai/logged";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(input: string): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [...messages, { role: "assistant", content }]);
      }

      return <div>{content}</div>;
    },
    tools: {
      showStockInformation: {
        description: "Get stock information for symbol for the last numOfMonths months",
        parameters: z.object({
          symbol: z.string().describe("The stock symbol to get information for"),
          numOfMonths: z.number().describe("The number of months to get historical information for"),
        }),
        generate: async ({ symbol, numOfMonths }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing stock information for ${symbol}`,
            },
          ]);

          return <Stock symbol={symbol} numOfMonths={numOfMonths} />;
        },
      },
      showLoggedTime: {
        description: "Get the total time logged for the user",
        parameters: z.object({
          userId: z.number().describe("The user ID to get the total time logged for"),
          startDate: z
            .string()
            .transform((str) => new Date(str))
            .describe("The start date to get the time logged for"),
          endDate: z
            .string()
            .transform((str) => new Date(str))
            .describe("The end date to get the time logged for"),
        }),
        generate: async ({ userId, startDate, endDate }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing logged time for for ${userId} between ${startDate} and ${endDate}`,
            },
          ]);

          return <TimeEntries userId={userId} startDate={startDate} endDate={endDate} />;
        },
      },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
