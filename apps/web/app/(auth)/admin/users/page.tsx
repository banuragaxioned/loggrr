import { auth } from "@workspace/auth";
import { UserList } from "./user-list";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getUsers() {
  try {
    const headersList = await headers();
    const result = await auth.api.listUsers({
      headers: headersList,
      query: {
        limit: 50,
      },
    });
    return result.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    }));
  } catch (error) {
    console.error(`Error fetching users from admin panel, error: ${error}`);
    return [];
  }
}

export default async function Page() {
  const users = await getUsers();

  return <UserList users={users} />;
}
