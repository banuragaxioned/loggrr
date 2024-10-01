import {
  pgTable,
  uniqueIndex,
  serial,
  text,
  boolean,
  timestamp,
  index,
  integer,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const projectInterval = pgEnum("ProjectInterval", ["FIXED", "MONTHLY"]);
export const role = pgEnum("Role", ["OWNER", "MANAGER", "USER", "GUEST", "INACTIVE"]);
export const status = pgEnum("Status", ["DRAFT", "PUBLISHED", "ARCHIVED", "DEACTIVATED"]);

// Workspace schema
export const workspace = pgTable(
  "Workspace",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    status: status("status").default("PUBLISHED").notNull(),
    domain: text("domain").unique(),
    domainVerified: boolean("domainVerified").default(false).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      domainKey: uniqueIndex("Workspace_domain_key").using("btree", table.domain.asc().nullsLast()),
      slugKey: uniqueIndex("Workspace_slug_key").using("btree", table.slug.asc().nullsLast()),
      workspaceDomainKey: uniqueIndex("workspace_domain_key").using("btree", table.domain.asc().nullsLast()),
      workspaceSlugKey: uniqueIndex("workspace_slug_key").using("btree", table.slug.asc().nullsLast()),
    };
  },
);

export const workspaceRelations = relations(workspace, ({ many }) => ({
  client: many(client),
  project: many(project),
  milestone: many(milestone),
  task: many(task),
  timeEntry: many(timeEntry),
  group: many(group),
  skill: many(skill),
  skillScore: many(skillScore),
  users: many(userWorkspace),
  userOnGroup: many(userOnGroup),
  usersOnProject: many(usersOnProject),
}));

// User workspace schema
export const userWorkspace = pgTable(
  "UserWorkspace",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: role("role").default("USER").notNull(),
    status: status("status").default("PUBLISHED").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("UserWorkspace_userId_idx").using("btree", table.userId.asc().nullsLast()),
      userIdWorkspaceIdIdx: index("UserWorkspace_userId_workspaceId_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.workspaceId.asc().nullsLast(),
      ),
      userIdWorkspaceIdKey: uniqueIndex("UserWorkspace_userId_workspaceId_key").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.workspaceId.asc().nullsLast(),
      ),
      userIdWorkspaceIdRoleIdx: index("UserWorkspace_userId_workspaceId_role_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.workspaceId.asc().nullsLast(),
        table.role.asc().nullsLast(),
      ),
      workspaceIdIdx: index("UserWorkspace_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      userWorkspaceUnique: uniqueIndex("user_workspace_unique").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.workspaceId.asc().nullsLast(),
      ),
      userWorkspaceUserIdx: index("user_workspace_user_idx").using("btree", table.userId.asc().nullsLast()),
      userWorkspaceWorkspaceIdx: index("user_workspace_workspace_idx").using(
        "btree",
        table.workspaceId.asc().nullsLast(),
      ),
    };
  },
);

export const userWorkspaceRelations = relations(userWorkspace, ({ one }) => ({
  user: one(user, { fields: [userWorkspace.userId], references: [user.id] }),
  workspace: one(workspace, { fields: [userWorkspace.workspaceId], references: [workspace.id] }),
}));

// Client schema
export const client = pgTable(
  "Client",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    status: status("status").default("PUBLISHED").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      workspaceIdIdx: index("Client_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      clientWorkspaceIdx: index("client_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
      clientWorkspaceIdWorkspaceIdFk: foreignKey({
        columns: [table.workspaceId],
        foreignColumns: [workspace.id],
        name: "Client_workspaceId_Workspace_id_fk",
      }),
    };
  },
);

export const clientRelations = relations(client, ({ one, many }) => ({
  workspace: one(workspace, { fields: [client.workspaceId], references: [workspace.id] }),
  project: many(project),
}));

// Project schema
export const project = pgTable(
  "Project",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: status("status").default("PUBLISHED").notNull(),
    ownerId: integer("ownerId")
      .notNull()
      .references(() => user.id),
    clientId: integer("clientId")
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    budget: integer("budget"),
    billable: boolean("billable").default(false).notNull(),
    interval: projectInterval("interval").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      clientIdIdx: index("Project_clientId_idx").using("btree", table.clientId.asc().nullsLast()),
      ownerIdIdx: index("Project_ownerId_idx").using("btree", table.ownerId.asc().nullsLast()),
      workspaceIdIdx: index("Project_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      projectClientIdx: index("project_client_idx").using("btree", table.clientId.asc().nullsLast()),
      projectOwnerIdx: index("project_owner_idx").using("btree", table.ownerId.asc().nullsLast()),
      projectWorkspaceIdx: index("project_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
    };
  },
);

export const projectRelations = relations(project, ({ one, many }) => ({
  workspace: one(workspace, { fields: [project.workspaceId], references: [workspace.id] }),
  owner: one(user, { fields: [project.ownerId], references: [user.id] }),
  client: one(client, { fields: [project.clientId], references: [client.id] }),
  milestone: many(milestone),
  task: many(task),
  timeEntry: many(timeEntry),
  usersOnProject: many(usersOnProject),
}));

// User on project schema
export const usersOnProject = pgTable(
  "UsersOnProject",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    projectId: integer("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: status("status").default("PUBLISHED").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      projectIdIdx: index("UsersOnProject_projectId_idx").using("btree", table.projectId.asc().nullsLast()),
      userIdIdx: index("UsersOnProject_userId_idx").using("btree", table.userId.asc().nullsLast()),
      userIdProjectIdIdx: index("UsersOnProject_userId_projectId_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
      ),
      userIdProjectIdKey: uniqueIndex("UsersOnProject_userId_projectId_key").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
      ),
      workspaceIdIdx: index("UsersOnProject_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      usersOnProjectProjectIdx: index("users_on_project_project_idx").using("btree", table.projectId.asc().nullsLast()),
      usersOnProjectUnique: uniqueIndex("users_on_project_unique").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
      ),
      usersOnProjectUserIdx: index("users_on_project_user_idx").using("btree", table.userId.asc().nullsLast()),
      usersOnProjectWorkspaceIdx: index("users_on_project_workspace_idx").using(
        "btree",
        table.workspaceId.asc().nullsLast(),
      ),
    };
  },
);

export const usersOnProjectRelations = relations(usersOnProject, ({ one }) => ({
  workspace: one(workspace, { fields: [usersOnProject.workspaceId], references: [workspace.id] }),
  project: one(project, { fields: [usersOnProject.projectId], references: [project.id] }),
  user: one(user, { fields: [usersOnProject.userId], references: [user.id] }),
}));

// Milestone schema
export const milestone = pgTable(
  "Milestone",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    projectId: integer("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    budget: integer("budget"),
    status: status("status").default("PUBLISHED").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      idProjectIdWorkspaceIdIdx: index("Milestone_id_projectId_workspaceId_idx").using(
        "btree",
        table.id.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
        table.workspaceId.asc().nullsLast(),
      ),
      projectIdIdx: index("Milestone_projectId_idx").using("btree", table.projectId.asc().nullsLast()),
      workspaceIdIdx: index("Milestone_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      milestoneProjectIdx: index("milestone_project_idx").using("btree", table.projectId.asc().nullsLast()),
      milestoneWorkspaceIdx: index("milestone_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
    };
  },
);

export const milestoneRelations = relations(milestone, ({ one, many }) => ({
  workspace: one(workspace, { fields: [milestone.workspaceId], references: [workspace.id] }),
  project: one(project, { fields: [milestone.projectId], references: [project.id] }),
  timeEntry: many(timeEntry),
}));

// Task schema
export const task = pgTable(
  "Task",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    projectId: integer("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: status("status").default("PUBLISHED").notNull(),
    budget: integer("budget"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      idProjectIdWorkspaceIdIdx: index("Task_id_projectId_workspaceId_idx").using(
        "btree",
        table.id.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
        table.workspaceId.asc().nullsLast(),
      ),
      projectIdIdx: index("Task_projectId_idx").using("btree", table.projectId.asc().nullsLast()),
      workspaceIdIdx: index("Task_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      taskProjectIdx: index("task_project_idx").using("btree", table.projectId.asc().nullsLast()),
      taskWorkspaceIdx: index("task_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
    };
  },
);

export const taskRelations = relations(task, ({ one, many }) => ({
  workspace: one(workspace, { fields: [task.workspaceId], references: [workspace.id] }),
  project: one(project, { fields: [task.projectId], references: [project.id] }),
  timeEntry: many(timeEntry),
}));

// Time entry schema
export const timeEntry = pgTable(
  "TimeEntry",
  {
    id: serial("id").primaryKey().notNull(),
    date: timestamp("date", { precision: 3, mode: "string" }).notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    projectId: integer("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    milestoneId: integer("milestoneId").references(() => milestone.id, { onDelete: "cascade" }),
    taskId: integer("taskId").references(() => task.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      milestoneIdIdx: index("TimeEntry_milestoneId_idx").using("btree", table.milestoneId.asc().nullsLast()),
      projectIdIdx: index("TimeEntry_projectId_idx").using("btree", table.projectId.asc().nullsLast()),
      taskIdIdx: index("TimeEntry_taskId_idx").using("btree", table.taskId.asc().nullsLast()),
      userIdIdx: index("TimeEntry_userId_idx").using("btree", table.userId.asc().nullsLast()),
      workspaceIdMilestoneIdIdx: index("TimeEntry_workspaceId_milestoneId_idx").using(
        "btree",
        table.workspaceId.asc().nullsLast(),
        table.milestoneId.asc().nullsLast(),
      ),
      workspaceIdProjectIdIdx: index("TimeEntry_workspaceId_projectId_idx").using(
        "btree",
        table.workspaceId.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
      ),
      workspaceIdProjectIdUserIdMilestoneIdTaskIdIdx: index(
        "TimeEntry_workspaceId_projectId_userId_milestoneId_taskId_idx",
      ).using(
        "btree",
        table.workspaceId.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
        table.userId.asc().nullsLast(),
        table.milestoneId.asc().nullsLast(),
        table.taskId.asc().nullsLast(),
      ),
      workspaceIdUserIdIdx: index("TimeEntry_workspaceId_userId_idx").using(
        "btree",
        table.workspaceId.asc().nullsLast(),
        table.userId.asc().nullsLast(),
      ),
      timeEntryWorkspaceProjectUserMilestoneTaskIdx: index(
        "time_entry_workspace_project_user_milestone_task_idx",
      ).using(
        "btree",
        table.workspaceId.asc().nullsLast(),
        table.projectId.asc().nullsLast(),
        table.userId.asc().nullsLast(),
        table.milestoneId.asc().nullsLast(),
        table.taskId.asc().nullsLast(),
      ),
    };
  },
);

export const timeEntryRelations = relations(timeEntry, ({ one }) => ({
  workspace: one(workspace, { fields: [timeEntry.workspaceId], references: [workspace.id] }),
  project: one(project, { fields: [timeEntry.projectId], references: [project.id] }),
  user: one(user, { fields: [timeEntry.userId], references: [user.id] }),
  milestone: one(milestone, { fields: [timeEntry.milestoneId], references: [milestone.id] }),
  task: one(task, { fields: [timeEntry.taskId], references: [task.id] }),
}));

// Skill score schema
export const skillScore = pgTable(
  "SkillScore",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    skillId: integer("skillId")
      .notNull()
      .references(() => skill.id, { onDelete: "cascade" }),
    level: integer("level").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      skillIdIdx: index("SkillScore_skillId_idx").using("btree", table.skillId.asc().nullsLast()),
      userIdIdx: index("SkillScore_userId_idx").using("btree", table.userId.asc().nullsLast()),
      workspaceIdIdx: index("SkillScore_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      skillScoreSkillIdx: index("skill_score_skill_idx").using("btree", table.skillId.asc().nullsLast()),
      skillScoreUserIdx: index("skill_score_user_idx").using("btree", table.userId.asc().nullsLast()),
      skillScoreWorkspaceIdx: index("skill_score_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
    };
  },
);

export const skillScoreRelations = relations(skillScore, ({ one }) => ({
  user: one(user, { fields: [skillScore.userId], references: [user.id] }),
  skill: one(skill, { fields: [skillScore.skillId], references: [skill.id] }),
  workspace: one(workspace, { fields: [skillScore.workspaceId], references: [workspace.id] }),
}));

// Skill schema
export const skill = pgTable(
  "Skill",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("Skill_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
    skillWorkspaceIdx: index("skill_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
  }),
);

export const skillRelations = relations(skill, ({ one, many }) => ({
  workspace: one(workspace, { fields: [skill.workspaceId], references: [workspace.id] }),
  skillScore: many(skillScore),
}));

// Group schema
export const group = pgTable(
  "Group",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("Group_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
    groupWorkspaceIdx: index("group_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
  }),
);

export const groupRelations = relations(group, ({ one, many }) => ({
  workspace: one(workspace, { fields: [group.workspaceId], references: [workspace.id] }),
  userOnGroup: many(userOnGroup),
}));

// User on group schema
export const userOnGroup = pgTable(
  "UserOnGroup",
  {
    id: serial("id").primaryKey().notNull(),
    workspaceId: integer("workspaceId")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    groupId: integer("groupId")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: status("status").default("PUBLISHED").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      groupIdIdx: index("UserOnGroup_groupId_idx").using("btree", table.groupId.asc().nullsLast()),
      userIdGroupIdIdx: index("UserOnGroup_userId_groupId_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.groupId.asc().nullsLast(),
      ),
      userIdGroupIdKey: uniqueIndex("UserOnGroup_userId_groupId_key").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.groupId.asc().nullsLast(),
      ),
      userIdIdx: index("UserOnGroup_userId_idx").using("btree", table.userId.asc().nullsLast()),
      workspaceIdIdx: index("UserOnGroup_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast()),
      userOnGroupGroupIdx: index("user_on_group_group_idx").using("btree", table.groupId.asc().nullsLast()),
      userOnGroupUnique: uniqueIndex("user_on_group_unique").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.groupId.asc().nullsLast(),
      ),
      userOnGroupUserIdx: index("user_on_group_user_idx").using("btree", table.userId.asc().nullsLast()),
      userOnGroupWorkspaceIdx: index("user_on_group_workspace_idx").using("btree", table.workspaceId.asc().nullsLast()),
    };
  },
);

export const userOnGroupRelations = relations(userOnGroup, ({ one }) => ({
  user: one(user, { fields: [userOnGroup.userId], references: [user.id] }),
  group: one(group, { fields: [userOnGroup.groupId], references: [group.id] }),
  workspace: one(workspace, { fields: [userOnGroup.workspaceId], references: [workspace.id] }),
}));

// User schema
export const user = pgTable(
  "User",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email").notNull().unique(),
    timezone: text("timezone").default("Etc/UTC").notNull(),
    emailVerified: timestamp("emailVerified", { precision: 3, mode: "string" }),
    image: text("image"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
    status: status("status").default("PUBLISHED").notNull(),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast()),
    };
  },
);

export const userRelations = relations(user, ({ one, many }) => ({
  accounts: many(account),
  sessions: many(session),
  skillScore: many(skillScore),
  timeEntry: many(timeEntry),
  ownedProjects: many(project),
  userWorkspaces: many(userWorkspace),
  usersOnGroup: many(userOnGroup),
  usersOnProject: many(usersOnProject),
}));

// Session schema
export const session = pgTable(
  "Session",
  {
    id: serial("id").primaryKey().notNull(),
    sessionToken: text("sessionToken").notNull(),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      sessionTokenKey: uniqueIndex("Session_sessionToken_key").using("btree", table.sessionToken.asc().nullsLast()),
      userIdIdx: index("Session_userId_idx").using("btree", table.userId.asc().nullsLast()),
      sessionUserIdx: index("session_user_idx").using("btree", table.userId.asc().nullsLast()),
    };
  },
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

// Verification token schema
export const verificationToken = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").using(
        "btree",
        table.identifier.asc().nullsLast(),
        table.token.asc().nullsLast(),
      ),
      tokenKey: uniqueIndex("VerificationToken_token_key").using("btree", table.token.asc().nullsLast()),
      verificationTokenUnique: uniqueIndex("verification_token_unique").using(
        "btree",
        table.identifier.asc().nullsLast(),
        table.token.asc().nullsLast(),
      ),
    };
  },
);

// Account schema
export const account = pgTable(
  "Account",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").using(
        "btree",
        table.provider.asc().nullsLast(),
        table.providerAccountId.asc().nullsLast(),
      ),
      userIdIdx: index("Account_userId_idx").using("btree", table.userId.asc().nullsLast()),
      accountUnique: uniqueIndex("account_unique").using(
        "btree",
        table.provider.asc().nullsLast(),
        table.providerAccountId.asc().nullsLast(),
      ),
      accountUserIdx: index("account_user_idx").using("btree", table.userId.asc().nullsLast()),
    };
  },
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));
