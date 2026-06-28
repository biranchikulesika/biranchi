import { Skeleton } from '@/components/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
        <Skeleton className="h-12 w-12 rounded-full mb-6" />
        <Skeleton className="h-8 w-48 mb-2" />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full mt-6" />
        </div>
      </div>
    </div>
  );
}
