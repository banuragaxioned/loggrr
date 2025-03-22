import { auth } from "@workspace/auth";
import { OrganizationList } from "./organization-list";
import { headers } from "next/headers";

async function getOrganizations() {
  try {
    const headersList = await headers();
    const result = await auth.api.listOrganizations({
      headers: headersList,
      query: {
        limit: 50,
      },
    });
    return result.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      image: org.image,
    }));
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

export default async function Page() {
  const organizations = await getOrganizations();

  return <OrganizationList organizations={organizations} />;
}
