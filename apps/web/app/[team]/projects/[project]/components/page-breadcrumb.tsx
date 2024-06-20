import { Home } from "lucide-react";
import Link from "next/link";
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

function PageBreadcrumb({ projectDetails, slug }: ProjectDetailsType) {
  return (
    <div className="shrink-0">
      {/* Breadcrumb */}
      <Breadcrumb className="p-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${slug}`}>
                <Home size={18} />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${slug}/projects`}>Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{projectDetails.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Heading */}
      <div className="mt-2 px-2">
        <h1>{projectDetails.name}</h1>
        <p className="text-sm text-muted-foreground">{projectDetails.client.name}</p>
      </div>
    </div>
  );
}

export default PageBreadcrumb;
