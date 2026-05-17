import { Star } from 'lucide-react';
import { cn } from '../utils/cn';

interface StarsProps {
  rating: number;
  size?: number;
  className?: string;
}

export function Stars({ rating, size = 14, className }: StarsProps) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? 'fill-accent text-accent'
              : 'fill-skeleton text-skeleton'
          }
        />
      ))}
    </span>
  );
}
