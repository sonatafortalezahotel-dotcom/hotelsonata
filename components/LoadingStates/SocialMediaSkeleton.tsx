import { Skeleton } from "@/components/ui/skeleton";

export default function SocialMediaSkeleton() {
  return (
    <section className="py-10 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 lg:mb-16">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="text-center mt-8 lg:mt-12">
          <Skeleton className="h-12 w-64 mx-auto" />
        </div>
      </div>
    </section>
  );
}

