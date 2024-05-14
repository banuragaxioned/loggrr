import { Home, Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ProjectDetailsType = {
  projectDetails: {
    name: string;
    client: {
      name: string;
    };
  };
  slug: string;
};

export function PageBreadcrumb({ projectDetails, slug }: ProjectDetailsType) {
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="p-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${slug}`}>
              <Home size={18} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="-rotate-[22deg]" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${slug}/projects`}>Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="-rotate-[22deg]" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{projectDetails.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Heading */}
      <div className="mt-2 p-2">
        <h1>{projectDetails.name}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{projectDetails.client.name}</p>
      </div>
    </div>
  );
}
