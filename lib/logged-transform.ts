export interface LoggedTransformOptions {
  shouldUseBillableBudgetHours: boolean;
  selectedGroupIds?: number[];
}

interface LoggedTimeEntry {
  formattedDate: string;
  date: Date | string;
  time: number;
  billable: boolean;
  comments: string | null;
  milestoneId?: number;
  milestone?: string;
  task?: string | null;
}

interface LoggedUser {
  userId: number;
  userName: string | null;
  userImage: string | null;
  userGroups: { id: number; name: string }[];
  userHours: number;
  userTimeEntry: LoggedTimeEntry[];
}

interface LoggedProject {
  projectId: number;
  projectName: string;
  projectBudget: number | null;
  projectInterval: "FIXED" | "MONTHLY";
  users: LoggedUser[];
}

interface LoggedClient {
  clientId: number;
  clientName: string;
  projects: LoggedProject[];
}

export interface LoggedTreeNode {
  type: "client" | "project" | "category" | "member" | "group" | "entry";
  id: number | string;
  name: string;
  hours?: number;
  billableHours?: number;
  budgetHours?: number;
  budget?: number | null;
  interval?: "FIXED" | "MONTHLY";
  description?: string | null;
  image?: string | null;
  billable?: boolean;
  task?: string | null;
  memberName?: string | null;
  date?: Date | string;
  groups?: { id: number; name: string }[];
  subRows?: LoggedTreeNode[];
}

const UNGROUPED = { id: -1, name: "Ungrouped" };

function roundHours(value: number) {
  return +`${value.toFixed(2)}`;
}

function getClientHours(client: LoggedClient) {
  return client.projects
    .flatMap((project) => project.users.map((user) => user.userHours))
    .reduce((sum, hours) => sum + hours, 0);
}

function getProjectHours(project: LoggedProject) {
  return project.users.reduce((sum, user) => sum + user.userHours, 0);
}

function getCategoryKey(time: LoggedTimeEntry) {
  return time.milestoneId != null ? `m-${time.milestoneId}` : "none";
}

function sortEntriesByDateDesc(entries: LoggedTreeNode[]) {
  return [...entries].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

function buildProjectSubRows(
  categoryMap: Map<
    string,
    {
      id: number;
      name: string;
      hours: number;
      leafRows: Map<number, LoggedTreeNode>;
    }
  >,
  buildLeafRows: (leafRows: Map<number, LoggedTreeNode>) => LoggedTreeNode[],
) {
  const hasRealCategory = Array.from(categoryMap.keys()).some((key) => key !== "none");

  if (hasRealCategory) {
    return Array.from(categoryMap.values()).map((category) => ({
      type: "category" as const,
      id: category.id,
      name: category.name,
      hours: roundHours(category.hours),
      subRows: buildLeafRows(category.leafRows),
    }));
  }

  return buildLeafRows(categoryMap.get("none")?.leafRows ?? new Map());
}

function buildMemberProjectSubRows(
  project: LoggedProject,
  shouldUseBillableBudgetHours: boolean,
): LoggedTreeNode[] {
  const categoryMap = new Map<
    string,
    {
      id: number;
      name: string;
      hours: number;
      leafRows: Map<number, LoggedTreeNode>;
    }
  >();

  project.users.forEach((user) => {
    user.userTimeEntry.forEach((time) => {
      const key = getCategoryKey(time);
      let category = categoryMap.get(key);

      if (!category) {
        category = {
          id: time.milestoneId ?? -1,
          name: time.milestone ?? "No category",
          hours: 0,
          leafRows: new Map(),
        };
        categoryMap.set(key, category);
      }

      category.hours += time.time;

      let member = category.leafRows.get(user.userId);
      if (!member) {
        member = {
          type: "member",
          id: user.userId,
          name: user.userName ?? "Unknown",
          image: user.userImage,
          groups: user.userGroups,
          hours: 0,
          billableHours: 0,
          budgetHours: 0,
          subRows: [],
        };
        category.leafRows.set(user.userId, member);
      }

      member.hours = (member.hours ?? 0) + time.time;
      if (time.billable) {
        member.billableHours = (member.billableHours ?? 0) + time.time;
      }

      member.subRows?.push({
        type: "entry",
        id: `${user.userId}-${String(time.date)}-${member.subRows.length}`,
        name: time.formattedDate,
        date: time.date,
        hours: time.time,
        description: time.comments,
        billable: time.billable,
        task: time.task ?? null,
      });
    });
  });

  const projectBudget = project.projectBudget ?? null;

  const buildMembers = (members: Map<number, LoggedTreeNode>) =>
    Array.from(members.values()).map((member) => ({
      ...member,
      hours: roundHours(member.hours ?? 0),
      billableHours: roundHours(member.billableHours ?? 0),
      budgetHours: roundHours(
        shouldUseBillableBudgetHours ? (member.billableHours ?? 0) : (member.hours ?? 0),
      ),
      budget: projectBudget,
    }));

  return buildProjectSubRows(categoryMap, buildMembers);
}

function buildGroupProjectSubRows(
  project: LoggedProject,
  _shouldUseBillableBudgetHours: boolean,
  selectedGroupIds: number[] = [],
): LoggedTreeNode[] {
  const categoryMap = new Map<
    string,
    {
      id: number;
      name: string;
      hours: number;
      leafRows: Map<number, LoggedTreeNode>;
    }
  >();

  project.users.forEach((user) => {
    const filteredGroups =
      selectedGroupIds.length > 0
        ? user.userGroups.filter((group) => selectedGroupIds.includes(group.id))
        : user.userGroups;

    const userGroups = filteredGroups.length > 0 ? filteredGroups : selectedGroupIds.length > 0 ? [] : [UNGROUPED];

    user.userTimeEntry.forEach((time) => {
      const key = getCategoryKey(time);
      let category = categoryMap.get(key);

      if (!category) {
        category = {
          id: time.milestoneId ?? -1,
          name: time.milestone ?? "No category",
          hours: 0,
          leafRows: new Map(),
        };
        categoryMap.set(key, category);
      }

      category.hours += time.time;

      userGroups.forEach((group) => {
        let groupRow = category!.leafRows.get(group.id);
        if (!groupRow) {
          groupRow = {
            type: "group",
            id: group.id,
            name: group.name,
            hours: 0,
            billableHours: 0,
            subRows: [],
          };
          category!.leafRows.set(group.id, groupRow);
        }

        groupRow.hours = (groupRow.hours ?? 0) + time.time;
        if (time.billable) {
          groupRow.billableHours = (groupRow.billableHours ?? 0) + time.time;
        }

        groupRow.subRows?.push({
          type: "entry",
          id: `${group.id}-${user.userId}-${String(time.date)}-${groupRow.subRows.length}`,
          name: time.formattedDate,
          date: time.date,
          hours: time.time,
          description: time.comments,
          billable: time.billable,
          task: time.task ?? null,
          memberName: user.userName,
        });
      });
    });
  });

  const buildGroups = (groups: Map<number, LoggedTreeNode>) =>
    Array.from(groups.values())
      .map((group) => ({
        ...group,
        hours: roundHours(group.hours ?? 0),
        billableHours: roundHours(group.billableHours ?? 0),
        subRows: sortEntriesByDateDesc(group.subRows ?? []),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

  return buildProjectSubRows(categoryMap, buildGroups);
}

function buildProjectNode(
  project: LoggedProject,
  shouldUseBillableBudgetHours: boolean,
  buildSubRows: (project: LoggedProject, shouldUseBillableBudgetHours: boolean) => LoggedTreeNode[],
): LoggedTreeNode {
  const projectHours = getProjectHours(project);
  let projectBillableHours = 0;

  project.users.forEach((user) => {
    user.userTimeEntry.forEach((time) => {
      if (time.billable) {
        projectBillableHours += time.time;
      }
    });
  });

  return {
    type: "project",
    id: project.projectId,
    name: project.projectName,
    hours: roundHours(projectHours),
    billableHours: roundHours(projectBillableHours),
    budgetHours: roundHours(shouldUseBillableBudgetHours ? projectBillableHours : projectHours),
    budget: project.projectBudget ?? null,
    interval: project.projectInterval,
    subRows: buildSubRows(project, shouldUseBillableBudgetHours),
  };
}

function buildLoggedTree(
  loggedData: LoggedClient[],
  options: LoggedTransformOptions,
  buildSubRows: (
    project: LoggedProject,
    shouldUseBillableBudgetHours: boolean,
    selectedGroupIds?: number[],
  ) => LoggedTreeNode[],
): LoggedTreeNode[] {
  return loggedData
    .filter((client) => getClientHours(client) > 0)
    .map((client) => ({
      type: "client" as const,
      id: client.clientId,
      name: client.clientName,
      hours: roundHours(getClientHours(client)),
      subRows: client.projects
        .filter((project) => getProjectHours(project) > 0)
        .map((project) =>
          buildProjectNode(project, options.shouldUseBillableBudgetHours, (p, shouldUseBillableBudgetHours) =>
            buildSubRows(p, shouldUseBillableBudgetHours, options.selectedGroupIds),
          ),
        ),
    }));
}

export function buildLoggedTreeByMember(
  loggedData: LoggedClient[],
  options: LoggedTransformOptions,
): LoggedTreeNode[] {
  return buildLoggedTree(loggedData, options, buildMemberProjectSubRows);
}

export function buildLoggedTreeByGroup(
  loggedData: LoggedClient[],
  options: LoggedTransformOptions,
): LoggedTreeNode[] {
  return buildLoggedTree(loggedData, options, buildGroupProjectSubRows);
}
