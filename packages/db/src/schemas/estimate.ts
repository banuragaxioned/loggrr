import { pgTable, text, timestamp, integer, pgEnum, decimal } from "drizzle-orm/pg-core";
import { project } from "./project";
import { member } from "./auth-schema";

export const estimateStatus = pgEnum("estimate_status", ["draft", "pending", "approved", "rejected", "cancelled"]);

export const skill = pgTable("skill", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdById: text("created_by_id")
    .references(() => member.id)
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const estimate = pgTable("estimate", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  projectId: text("project_id")
    .references(() => project.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: estimateStatus("status").default("draft").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdById: text("created_by_id")
    .references(() => member.id)
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const estimateItem = pgTable("estimate_item", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  estimateId: text("estimate_id")
    .references(() => estimate.id)
    .notNull(),
  skillId: text("skill_id")
    .references(() => skill.id)
    .notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(), // Rate per 60 minutes
  currency: text("currency").default("USD").notNull(),
  createdById: text("created_by_id")
    .references(() => member.id)
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assignment = pgTable("assignment", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  projectId: text("project_id")
    .references(() => project.id)
    .notNull(),
  memberId: text("member_id")
    .references(() => member.id)
    .notNull(),
  estimateItemId: text("estimate_item_id")
    .references(() => estimateItem.id)
    .notNull(),
  createdById: text("created_by_id")
    .references(() => member.id)
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
