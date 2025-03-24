import { authClient } from "@workspace/auth/client";
import { toast } from "@workspace/ui/components/sonner";

export async function getOrganizations() {
  const { data } = await authClient.organization.list();
  return data;
}

export async function setActiveOrganization(slug: string) {
  const { data, error } = await authClient.organization.setActive({
    organizationSlug: slug,
  });

  if (error) {
    toast.error(error.message);
  }

  return data;
}

export async function useActiveOrganization() {
  const { data } = authClient.useActiveOrganization();
  return data?.slug;
}
