"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

export function Analytics() {
  return <VercelAnalytics />;
}

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(String(process.env.NEXT_PUBLIC_POSTHOG_KEY), {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export default function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
