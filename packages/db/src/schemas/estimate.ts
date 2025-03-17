import { pgTable, text, timestamp, integer, pgEnum, decimal, index, date } from "drizzle-orm/pg-core";
import { project } from "./project";
import { member } from "./auth-schema";
import { skill } from "./skill";

export const estimateStatus = pgEnum("estimate_status", ["draft", "pending", "approved", "rejected", "cancelled"]);

export const estimate = pgTable(
  "estimate",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    projectId: text("project_id")
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
  },
  (table) => ({
    orgIdx: index("estimate_org_idx").on(table.organizationId),
    projectIdx: index("estimate_project_idx").on(table.projectId),
    statusIdx: index("estimate_status_idx").on(table.status),
  }),
);

export const estimateItem = pgTable(
  "estimate_item",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    estimateId: text("estimate_id")
      .references(() => estimate.id, { onDelete: "cascade" })
      .notNull(),
    skillId: text("skill_id")
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
  },
  (table) => ({
    orgIdx: index("estimate_item_org_idx").on(table.organizationId),
    estimateIdx: index("estimate_item_estimate_idx").on(table.estimateId),
    skillIdx: index("estimate_item_skill_idx").on(table.skillId),
  }),
);

export const assignment = pgTable(
  "assignment",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    projectId: text("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
    memberId: text("member_id")
      .references(() => member.id, { onDelete: "cascade" })
      .notNull(),
    estimateItemId: text("estimate_item_id")
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
  },
  (table) => ({
    orgIdx: index("assignment_org_idx").on(table.organizationId),
    projectIdx: index("assignment_project_idx").on(table.projectId),
    memberIdx: index("assignment_member_idx").on(table.memberId),
    estimateItemIdx: index("assignment_estimate_item_idx").on(table.estimateItemId),
  }),
);
