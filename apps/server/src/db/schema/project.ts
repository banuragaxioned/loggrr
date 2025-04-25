import { pgTable, text, timestamp, boolean, pgEnum, integer } from "drizzle-orm/pg-core";

export const status = pgEnum("status", ["draft", "active", "completed", "cancelled"]);
export const taskStatus = pgEnum("task_status", ["pending", "in_progress", "completed", "cancelled"]);

export const client = pgTable("client", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const project = pgTable("project", {
  id: integer("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  clientId: integer("client_id")
    .references(() => client.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  archived: boolean("archived").default(false).notNull(),
  status: status("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const category = pgTable("category", {
  id: integer("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  projectId: integer("project_id")
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
  id: integer("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  projectId: integer("project_id")
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

export type Client = typeof client.$inferSelect;
export type NewClient = typeof client.$inferInsert;

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;

export type Task = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;
