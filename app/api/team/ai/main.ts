import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

import { env } from "@/env.mjs";

export const config = {
  maxDuration: 30,
};

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

const timeLogSchema = z.object({
  data: z.array(
    z.object({
      id: z.number().describe("the matching project id from the provided projects list"),
      name: z.string().describe("the project name"),
      milestone: z.object({ id: z.number(), name: z.string() }).optional(),
      task: z.object({ id: z.number(), name: z.string() }).optional(),
      billable: z.boolean().optional().describe("defaults to true"),
      time: z.string().describe("numeric value of hours, without any unit"),
      comments: z.string(),
      date: z.string().describe("the entry date in yyyy-MM-dd format"),
    }),
  ),
});

export type TimeLog = z.infer<typeof timeLogSchema>;

export async function loggr(input: string) {
  if (!input) return { message: "No input provided", status: 400 };

  try {
    const today = new Date().toISOString().split("T")[0];
    const { object } = await generateObject({
      model: openrouter("moonshotai/kimi-k2.6"),
      schema: timeLogSchema,
      system:
        `You convert a user's natural-language description of their work into structured time entries. ` +
        `Map each entry to the matching project from the provided "projects" list using its id and name. ` +
        `Today's date is ${today}; use it to resolve relative dates.`,
      prompt: input,
    });

    return { message: "Success", result: object, status: 200 };
  } catch (error) {
    return { message: "Error processing request", error, status: 500 };
  }
}
