import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { member } from "./auth-schema";

export const skill = pgTable(
  "skill",
  {
    id: text("id").primaryKey(),
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
  },
  (table) => ({
    orgIdx: index("skill_org_idx").on(table.organizationId),
  }),
);

export const memberSkill = pgTable(
  "member_skill",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    memberId: text("member_id")
      .references(() => member.id, { onDelete: "cascade" })
      .notNull(),
    skillId: text("skill_id")
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
  },
  (table) => ({
    orgIdx: index("member_skill_org_idx").on(table.organizationId),
    memberIdx: index("member_skill_member_idx").on(table.memberId),
    skillIdx: index("member_skill_skill_idx").on(table.skillId),
    uniqueMemberSkill: uniqueIndex("unique_member_skill").on(table.memberId, table.skillId),
  }),
);
