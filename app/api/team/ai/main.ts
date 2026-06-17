import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

import { env } from "@/env.mjs";

export const config = {
  maxDuration: 30,
};

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

const timeLogSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.number().int().describe("the id of the matching project from the provided projects list"),
        name: z.string().describe("the exact name of the matching project from the provided projects list"),
        milestone: z
          .object({ id: z.number().int(), name: z.string() })
          .nullable()
          .describe("the matching milestone, or null if none is mentioned"),
        task: z
          .object({ id: z.number().int(), name: z.string() })
          .nullable()
          .describe("the matching task, or null if none is mentioned"),
        billable: z.boolean().describe("whether the entry is billable; true unless the user clearly says otherwise"),
        time: z.number().describe("hours worked as a decimal number with no unit, e.g. 3 or 1.5"),
        comments: z.string().describe("a short description of the work done"),
        date: z.string().describe("the entry date in yyyy-MM-dd format; today if the user does not specify one"),
      }),
    )
    .describe("one entry per distinct piece of work the user describes"),
});

export type TimeLog = z.infer<typeof timeLogSchema>;

export async function loggr(input: string) {
  if (!input) return { message: "No input provided", status: 400 };

  try {
    const today = new Date().toISOString().split("T")[0];
    const { object } = await generateObject({
      model: openrouter("deepseek/deepseek-v4-flash"),
      schema: timeLogSchema,
      system:
        `You convert a user's natural-language description of their work into structured time entries. ` +
        `Map each entry to the matching project from the provided "projects" list using its id and name. ` +
        `Today's date is ${today}; use it to resolve relative dates.`,
      prompt: input,
    });

    return { message: "Success", result: object, status: 200 };
  } catch (error) {
    // Surface the real cause in the server logs — a raw Error doesn't survive JSON.
    console.error("[/api/team/ai] generateObject failed:", error);
    const message = error instanceof Error ? error.message : "Error processing request";
    return { message, status: 500 };
  }
}
