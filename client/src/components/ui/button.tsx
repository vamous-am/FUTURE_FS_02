import { cn } from '../../lib/cn.js';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

/** General-purpose button with variant and size options. */
export function Button({
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'border border-input bg-background hover:bg-accent': variant === 'outline',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'h-8 px-3 text-xs': size === 'sm',
          'h-9 px-4 py-2 text-sm': size === 'md',
        },
        className,
      )}
      {...props}
    />
  );
}
