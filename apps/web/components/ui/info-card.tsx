import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { UserAvatar } from "./user-avatar";
import Link from "next/link";

interface InfoCardProps {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  href: string;
  showAvatar?: boolean;
}

export function InfoCard({ title, description, image, href, showAvatar = false }: InfoCardProps) {
  return (
    <Link href={href}>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          {showAvatar && <UserAvatar name={title} image={image} className="h-12 w-12" />}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
