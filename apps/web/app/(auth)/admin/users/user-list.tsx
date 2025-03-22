import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

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
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
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
