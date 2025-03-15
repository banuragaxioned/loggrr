import { pgTable, text, timestamp, boolean, pgEnum, integer } from "drizzle-orm/pg-core";
import { nanoid } from "../utils/nano";

export const status = pgEnum("status", ["draft", "active", "completed", "cancelled"]);
export const taskStatus = pgEnum("task_status", ["pending", "in_progress", "completed", "cancelled"]);

export const project = pgTable("project", {
  id: text("id")
    .$defaultFn(() => nanoid(10))
    .primaryKey()
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  archived: boolean("archived").default(false).notNull(),
  status: status("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const milestone = pgTable("milestone", {
  id: text("id")
    .$defaultFn(() => nanoid(10))
    .primaryKey()
    .notNull(),
  projectId: text("project_id")
    .references(() => project.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  estimate: integer("estimate"),
  spent: integer("spent"),
  status: status("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const task = pgTable("task", {
  id: text("id")
    .$defaultFn(() => nanoid(10))
    .primaryKey()
    .notNull(),
  projectId: text("project_id")
    .references(() => project.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  estimate: integer("estimate"),
  spent: integer("spent"),
  status: taskStatus("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
