import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function GET() {
  try{
    const session = await getServerSession(authOptions);
  
    return new Response(JSON.stringify(session?.user));
  } catch (error) {
    console.log(error)
  } 
}
