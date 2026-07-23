import { cn } from '../../lib/cn.js';
import type { HTMLAttributes } from 'react';

/** Animated placeholder for loading states. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}
