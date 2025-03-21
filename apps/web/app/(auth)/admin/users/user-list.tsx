import { Card, CardHeader, CardTitle } from "@workspace/ui/components/card";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.role && <p className="text-xs text-muted-foreground mt-1">Role: {user.role}</p>}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
