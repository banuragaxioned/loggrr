"use server";

import { z } from "zod";
import { db } from "@/server/db";

const schema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
});

type Form = z.infer<typeof schema>;

export async function createWorkspace(formData: Form) {
  try {
    await db.workspace.create({
      data: {
        name: formData.name,
        slug: formData.slug,
      },
    });
  } catch (e) {
    throw new Error("Failed to create workspace");
  }
  return { success: true };
}
