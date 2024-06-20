"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/env.mjs";

if (typeof window !== "undefined" && env.NODE_ENV === "production") {
  posthog.init(String(env.NEXT_PUBLIC_POSTHOG_KEY), {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export default function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
