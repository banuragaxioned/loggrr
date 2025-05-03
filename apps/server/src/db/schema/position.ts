import { pgTable, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { member } from "./auth";

export const position = pgTable("position", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdById: text("created_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const positionLevel = pgTable("position_level", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  positionId: integer("position_id")
    .references(() => position.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // e.g., "Junior", "Senior", "Lead"
  description: text("description"),
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

export const memberPosition = pgTable("member_position", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  memberId: text("member_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  positionId: integer("position_id")
    .references(() => position.id, { onDelete: "cascade" })
    .notNull(),
  levelId: integer("level_id")
    .references(() => positionLevel.id, { onDelete: "cascade" })
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

export type Position = typeof position.$inferSelect;
export type NewPosition = typeof position.$inferInsert;

export type PositionLevel = typeof positionLevel.$inferSelect;
export type NewPositionLevel = typeof positionLevel.$inferInsert;

export type MemberPosition = typeof memberPosition.$inferSelect;
export type NewMemberPosition = typeof memberPosition.$inferInsert;
