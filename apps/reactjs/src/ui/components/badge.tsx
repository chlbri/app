import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500',
  {
    variants: {
      variant: {
        default:
          'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm',
        secondary: 'border border-slate-700 bg-slate-800 text-slate-300',
        active:
          'border border-teal-500/30 bg-teal-500/15 text-teal-300 animate-pulse',
        warning:
          'border border-amber-500/30 bg-amber-500/10 text-amber-300',
        danger: 'border border-rose-500/30 bg-rose-500/10 text-rose-300',
        purple:
          'border border-purple-500/30 bg-purple-500/10 text-purple-300',
        blue: 'border border-sky-500/30 bg-sky-500/10 text-sky-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
