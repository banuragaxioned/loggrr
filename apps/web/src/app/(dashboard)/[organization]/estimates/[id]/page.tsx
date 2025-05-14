"use client";

import { EstimateItemsClient } from "./estimate-items-client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EstimateSkeleton } from "./estimate-skeleton";
import { use } from "react";

interface PageProps {
  params: Promise<{
    organization: string;
    id: string;
  }>;
}

export default function EstimatePage({ params }: PageProps) {
  const { id } = use(params);

  const estimate = useQuery({
    ...trpc.estimate.getById.queryOptions({ id: Number(id) }),
  });

  if (estimate.isLoading) {
    return <EstimateSkeleton />;
  }

  if (!estimate.data?.[0]) {
    return <div>Estimate not found</div>;
  }

  const estimateData = estimate.data[0];

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{estimateData.name}</CardTitle>
              <CardDescription>{estimateData.projectName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p>{estimateData.status}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p>{format(new Date(estimateData.startDate), "MMM d, yyyy")}</p>
              </div>
              {estimateData.endDate && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p>{format(new Date(estimateData.endDate), "MMM d, yyyy")}</p>
                </div>
              )}
              {estimateData.description && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{estimateData.description}</p>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Estimate
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-9">
          <EstimateItemsClient id={id} />
        </div>
      </div>
    </div>
  );
}
