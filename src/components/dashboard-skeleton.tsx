import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 max-h-screen overflow-y-auto">
      <Skeleton className="w-2/3 h-[50px]" />
      <Separator />
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-1/2 h-[30px]" />
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-1/2 h-[30px]" />
      <Skeleton className="w-full h-[30px]" />
      <Separator />
      <Skeleton className="w-1/3 h-[60px]" />
      <Skeleton className="w-full h-[400px]" />
      <Separator />
      <Skeleton className="h-[50px] w-1/2" />
    </div>
  );
}
