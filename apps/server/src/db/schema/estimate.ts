import { pgTable, text, timestamp, integer, pgEnum, decimal, date } from "drizzle-orm/pg-core";
import { project } from "./project";
import { member } from "./auth";
import { skill } from "./skill";

export const estimateStatus = pgEnum("estimate_status", ["draft", "pending", "approved", "rejected", "cancelled"]);

export const estimate = pgTable("estimate", {
  id: integer("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: estimateStatus("status").default("draft").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  createdById: text("created_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const estimateItem = pgTable("estimate_item", {
  id: integer("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  estimateId: integer("estimate_id")
    .references(() => estimate.id, { onDelete: "cascade" })
    .notNull(),
  skillId: integer("skill_id")
    .references(() => skill.id, { onDelete: "cascade" })
    .notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(), // Rate per 60 minutes
  currency: text("currency").default("USD").notNull(),
  createdById: text("created_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assignment = pgTable("assignment", {
  id: integer("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  memberId: text("member_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  estimateItemId: integer("estimate_item_id")
    .references(() => estimateItem.id, { onDelete: "cascade" })
    .notNull(),
  createdById: text("created_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Estimate = typeof estimate.$inferSelect;
export type NewEstimate = typeof estimate.$inferInsert;

export type EstimateItem = typeof estimateItem.$inferSelect;
export type NewEstimateItem = typeof estimateItem.$inferInsert;

export type Assignment = typeof assignment.$inferSelect;
export type NewAssignment = typeof assignment.$inferInsert;
