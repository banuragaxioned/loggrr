import { getMembers } from "@/server/services/members";

const Members = async({params}:{params:{team:string}})=> {

    const {team} = params;
    const members = await getMembers(team);
    console.log(members)

    return (
        <h3>Memebers</h3>
    )
}

export default Members
