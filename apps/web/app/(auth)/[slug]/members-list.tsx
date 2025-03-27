"use client";

import { UserAvatar } from "@/components/ui/user-avatar";
import { authClient } from "@workspace/auth/client";
import { useEffect, useState } from "react";

type Member = Awaited<ReturnType<typeof authClient.organization.getActiveMember>>["data"];

export function MembersList() {
  const [data, setData] = useState<Member | null>(null);

  useEffect(() => {
    authClient.organization.getActiveMember().then((res) => {
      if (res.data) setData(res.data);
    });
  }, []);

  if (!data) return null;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <UserAvatar name={data.user.name} image={data.user.image} />
        <div>
          <p className="text-sm font-medium">{data.user.name}</p>
          <p className="text-sm text-muted-foreground">{data.role}</p>
        </div>
      </div>
    </div>
  );
}
