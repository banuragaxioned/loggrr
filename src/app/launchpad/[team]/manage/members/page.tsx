import { getMembers } from "@/server/services/members";
import { DataTable } from "./data-table";

const Members = async({params}:{params:{team:string}})=> {

    const {team} = params;
    const members = await getMembers(team);

    return (
        <DataTable data={members}/>
    ) 
}

export default Members
