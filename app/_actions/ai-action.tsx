"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import { ShowTimeEntries, ShowTimeEntriesSkeleton } from "@/components/ai/logged";
import { getCurrentUser } from "@/server/session";

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
  const user = await getCurrentUser();
  const workspace = "axioned";

  const result = await streamUI({
    model: openai("gpt-4o"),
    system:
      `You help users understand their time entries for the workspace ${workspace}. ` +
      `For context, today's date is ${new Date()} and the current user is ${user?.name} and their userId is ${user?.id}.`,
    // `They can't ask for other's data.`
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [...messages, { role: "assistant", content }]);
      }

      return <div>{content}</div>;
    },
    tools: {
      showLoggedTime: {
        description: "Get the total time logged for the user",
        parameters: z.object({
          workspace: z.string().min(1).describe("The workspace slug to get the time logged for"),
          startDate: z
            .string()
            .transform((str) => new Date(str))
            .describe("The start date to get the time logged for"),
          endDate: z
            .string()
            .transform((str) => new Date(str))
            .describe("The end date to get the time logged for"),
          userId: z.number().optional().describe("The user ID to get the total time logged for"),
          billable: z
            .boolean()
            .optional()
            .describe("True for billable time, false for non-billable time. Defaults to all time."),
        }),
        generate: async function* ({ workspace, userId, startDate, endDate, billable }) {
          yield <ShowTimeEntriesSkeleton />;
          history.done((messages: ClientMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing billable logged time for for ${userId} between ${startDate} and ${endDate} on the workspace ${workspace}.`,
            },
          ]);
          return (
            <ShowTimeEntries
              workspace={workspace}
              userId={userId}
              startDate={startDate}
              endDate={endDate}
              billable={billable}
            />
          );
        },
      },
      showProjects: {
        description: "Show the projects for the user",
        parameters: z.object({
          workspace: z.string().min(1).describe("The workspace slug to get the projects for"),
          userId: z.number().optional().describe("The user ID to get the projects for"),
        }),
        generate: async function* ({ workspace, userId }) {
          yield `Showing projects for ${userId} on the workspace ${workspace}.`;
          const projects = [
            { id: 1, name: "Project 1" },
            { id: 2, name: "Project 2" },
          ];
          return (
            <div>
              {projects.map((project) => (
                <div key={project.id}>{project.name}</div>
              ))}
            </div>
          );
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
