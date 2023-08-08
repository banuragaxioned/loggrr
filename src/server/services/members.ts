import { Tenant, User } from "@prisma/client";
import { prisma } from "../db";
import { db } from "@/lib/db";


export const getMembers = async (team:string)=> {
    const members = db.tenant.findMany({
        where:{slug:team},
        select:{
            Users:{
                select:{
                    id:true,
                    name:true,
                    image:true,
                    Roles:{
                        select:{
                            id:true,
                            role:true
                        }
                    }
                }
            }
        }
    });

    return members;
}