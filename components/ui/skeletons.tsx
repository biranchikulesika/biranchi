import React from 'react';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-primary/10 ${className}`}
      {...props}
    />
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-10 w-full max-w-2xl">
      <Skeleton className="h-10 w-3/4 mb-4" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-5/6" />
    </div>
  );
}

export function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
      {Array.from({ length: 6 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <Skeleton className="w-full aspect-[3/2] rounded-md" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function DashboardTableSkeleton() {
  return (
    <div className="w-full border border-border rounded-lg overflow-hidden bg-background">
      <div className="bg-muted p-4 border-b border-border">
        <Skeleton className="h-5 w-1/4" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-2 w-1/2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostContentSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12">
      <Skeleton className="h-4 w-24 mb-6" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-4/5 mb-8" />
      <div className="flex gap-4 mb-12 border-b border-border pb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        
        <Skeleton className="h-64 w-full my-8" />
        
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function NewsletterFormSkeleton() {
  return (
    <div className="w-full max-w-xl">
      <PageHeaderSkeleton />
      <div className="mt-8 flex flex-col gap-4">
        <Skeleton className="h-12 w-full border-b" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="w-full max-w-3xl flex flex-col gap-8">
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-4 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="flex flex-col w-full">
      <section className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-16 lg:px-24 pt-20 pb-8 md:pt-36 md:pb-16 relative w-full border-b border-border min-h-[70vh]">
        <div className="mx-auto w-full max-w-300 flex flex-col gap-8 md:gap-16">
          <Skeleton className="h-20 md:h-32 w-2/3 md:w-1/2" />
          <Skeleton className="h-16 w-full max-w-175" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 w-full mt-2 md:mt-6">
            <Skeleton className="h-27.5 md:h-42.5 w-full rounded-2xl" />
            <Skeleton className="h-27.5 md:h-42.5 w-full rounded-2xl" />
            <Skeleton className="h-27.5 md:h-42.5 w-full rounded-2xl" />
            <Skeleton className="h-27.5 md:h-42.5 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
