import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export function useValidateTenantAccess() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const currentProject = router.query.pid as string;
  console.log(router.query);
  const validatedData = api.tenant.validateTenantAccess.useQuery(
    { text: currentTenant },
    { enabled: session?.user !== undefined }
  );

  const isLoading = status === "loading" || validatedData.isLoading;

  const isInvalid =
    status === "unauthenticated" ||
    validatedData.data?.slug !== router.query.team;

  const slug = currentTenant;

  return {
    isLoading,
    isInvalid,
    slug,
    pid: currentProject,
  };
}
