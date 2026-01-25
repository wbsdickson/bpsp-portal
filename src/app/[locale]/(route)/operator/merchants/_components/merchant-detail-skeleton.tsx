import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export function MerchantDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Card Content */}
      <Card className="bg-card rounded-lg p-4">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Name Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Merchant ID Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Registration Date Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Additional Fields Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Representative */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Fee rate */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-1/4" />
          </div>

          {/* Transaction Count */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-1/4" />
          </div>

          {/* Transaction Amount */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-1/3" />
          </div>

          {/* Contact person */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Contact email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </Card>
    </div>
  );
}
