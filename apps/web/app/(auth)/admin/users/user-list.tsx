import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { UserAvatar } from "@/components/ui/user-avatar";
interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
}

export function UserList({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-3">
              <UserAvatar name={user.name} image={user.image!} />
              {user.name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role || "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
