import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { member } from "./auth";

export const skill = pgTable("skill", {
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

export const memberSkill = pgTable("member_skill", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: text("organization_id").notNull(),
  memberId: text("member_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  skillId: integer("skill_id")
    .references(() => skill.id, { onDelete: "cascade" })
    .notNull(),
  level: text("level").notNull(), // e.g., "beginner", "intermediate", "expert"
  createdById: text("created_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  updatedById: text("updated_by_id")
    .references(() => member.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Skill = typeof skill.$inferSelect;
export type NewSkill = typeof skill.$inferInsert;

export type MemberSkill = typeof memberSkill.$inferSelect;
export type NewMemberSkill = typeof memberSkill.$inferInsert;
