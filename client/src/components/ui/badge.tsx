import { cn } from '../../lib/cn.js';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'new' | 'contacted' | 'converted' | 'default';

const variants: Record<BadgeVariant, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  converted: 'bg-green-100 text-green-800',
  default: 'bg-gray-100 text-gray-800',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/** Status badge with color variants matching lead status values. */
export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
