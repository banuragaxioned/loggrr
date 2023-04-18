import { api } from "@/lib/api";

export async function getUserTeamList() {
  const { data: myTeamData } = api.tenant.myTeams.useQuery();

  if (!myTeamData) {
    throw new Error("No team data found")
  }

  return (
    myTeamData
  );
}
