import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { category, project, task } from "./project";
import { user } from "./auth-schema";

export const time = pgTable("time", {
  id: text("id").primaryKey(),
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
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
