'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { usePathname, useParams } from "next/navigation";

export function useValidateTeamAccess() {
  const { status } = useSession();
  const router = useRouter();
  const path = router.asPath;
  const currentTeam = String(router.query.team);
  const currentProject = String(router.query.pid);

  const validatedData = api.tenant.validateTeamAccess.useQuery({
    text: currentTeam,
  });

  const isLoading = status === "loading" || validatedData.isLoading;

  const isInvalid = status === "unauthenticated" || validatedData.data?.slug !== router.query.team;

  const isReady = router.query !== undefined && status === "authenticated" && !isInvalid;

  return {
    isLoading,
    isInvalid,
    isReady,
    currentTeam,
    pid: currentProject,
    path,
  };
}
