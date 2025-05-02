import { pgTable, text, timestamp, integer, pgEnum, decimal } from "drizzle-orm/pg-core";
import { category, project, task } from "./project";
import { member } from "./auth";

export const timeLogStatus = pgEnum("time_log_status", ["pending", "approved", "rejected", "invoiced"]);

export const timeLog = pgTable("time_log", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: integer("category_id")
    .references(() => category.id, { onDelete: "set null" })
    .notNull(),
  taskId: integer("task_id")
    .references(() => task.id, { onDelete: "set null" })
    .notNull(),
  memberId: text("member_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration").notNull(),
  multiplier: decimal("multiplier", { precision: 4, scale: 2 }).default("1.00").notNull(),
  status: timeLogStatus("status").default("pending").notNull(),
  createdById: text("created_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type TimeLog = typeof timeLog.$inferSelect;
export type NewTimeLog = typeof timeLog.$inferInsert;
