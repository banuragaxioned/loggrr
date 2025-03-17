import { pgTable, text, timestamp, integer, pgEnum, decimal } from "drizzle-orm/pg-core";
import { category, project, task } from "./project";
import { user } from "./auth-schema";

export const timeLogStatus = pgEnum("time_log_status", ["pending", "approved", "rejected", "invoiced"]);

export const timeLog = pgTable("time_log", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  projectId: text("project_id")
    .references(() => project.id)
    .notNull(),
  categoryId: text("category_id").references(() => category.id),
  taskId: text("task_id").references(() => task.id),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration").notNull(),
  multiplier: decimal("multiplier", { precision: 4, scale: 2 }).default("1.00").notNull(),
  status: timeLogStatus("status").default("pending").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
