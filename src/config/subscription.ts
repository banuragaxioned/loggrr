import { SubscriptionPlan } from "@/types";

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "The free plan is limited to 3 members. Upgrade to PRO to remove this limit.",
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan has unlimited posts.",
  stripePriceId: process.env.STRIPE_PRO_MONTHLY_PLAN_ID ?? "",
};
