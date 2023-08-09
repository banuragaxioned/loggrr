import { getMembers } from "@/server/services/members";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { DataTable } from "./data-table";

const Members = async({params}:{params:{team:string}})=> {

    const {team} = params;
    const members = await getMembers(team);

    return (
        <DashboardShell>
        <DashboardHeader heading="Members" text={`This is a list of  all the member in ${team} team `}></DashboardHeader>
        <DataTable data={members}/>
        </DashboardShell>
    ) 
}

export default Members
