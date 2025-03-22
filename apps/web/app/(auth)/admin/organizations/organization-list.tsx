import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

interface Organization {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export function OrganizationList({ organizations }: { organizations: Organization[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization</TableHead>
          <TableHead>Slug</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={org.image || undefined} alt={org.name} />
                <AvatarFallback>{org.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {org.name}
            </TableCell>
            <TableCell>{org.slug}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
