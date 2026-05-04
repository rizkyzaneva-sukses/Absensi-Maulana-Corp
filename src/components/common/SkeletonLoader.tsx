import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  type?: 'line' | 'card' | 'table-row' | 'avatar';
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn('h-4 bg-muted rounded animate-pulse', className)} />
  );
}

export function SkeletonLoader({ className, count = 3, type = 'line' }: SkeletonLoaderProps) {
  if (type === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <SkeletonLine className="h-5 w-1/3" />
            <SkeletonLine className="h-4 w-2/3" />
            <SkeletonLine className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 p-3">
            <SkeletonLine className="h-4 flex-1" />
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2 flex-1">
          <SkeletonLine className="h-4 w-1/3" />
          <SkeletonLine className="h-3 w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} className={i === 0 ? 'w-3/4' : i === count - 1 ? 'w-1/2' : 'w-full'} />
      ))}
    </div>
  );
}
