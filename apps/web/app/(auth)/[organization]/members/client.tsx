"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@workspace/auth/client";
import { useParams } from "next/navigation";

export function MembersList() {
  const { organization } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["organization", "members", organization],
    queryFn: async () => {
      const response = await authClient.organization.getFullOrganization();
      return response;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <pre>{JSON.stringify(data?.data?.members, null, 2)}</pre>
    </div>
  );
}
