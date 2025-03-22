import { Card, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

interface Organization {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export function OrganizationList({ organizations }: { organizations: Organization[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <Card key={org.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={org.image || undefined} alt={org.name} />
              <AvatarFallback>{org.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{org.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{org.slug}</p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
