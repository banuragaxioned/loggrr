"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { authClient } from "@workspace/auth/client";

export async function MembersList() {
  const { data: member } = await authClient.organization.getActiveMember();

  if (!member) return null;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <Avatar>
          <AvatarImage src={member.user.image!} />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{member.role}</p>
          <p className="text-sm text-muted-foreground">Member ID: {member.id}</p>
        </div>
      </div>
    </div>
  );
}
