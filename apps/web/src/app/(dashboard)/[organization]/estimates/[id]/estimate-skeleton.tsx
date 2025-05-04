import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EstimateSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-9">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  );
}
