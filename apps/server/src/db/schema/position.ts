import { pgTable, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { member } from "./auth";

export const position = pgTable("position", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
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

export const rateCard = pgTable("rate_card", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  positionId: integer("position_id")
    .references(() => position.id, { onDelete: "cascade" })
    .notNull(),
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
  rateCardId: integer("rate_card_id")
    .references(() => rateCard.id, { onDelete: "cascade" })
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

export type RateCard = typeof rateCard.$inferSelect;
export type NewRateCard = typeof rateCard.$inferInsert;

export type MemberPosition = typeof memberPosition.$inferSelect;
export type NewMemberPosition = typeof memberPosition.$inferInsert;
