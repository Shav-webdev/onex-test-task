'use client';

import { useQueryStates } from 'nuqs';
import { usersSearchParamsParsers, type SortField } from '@/shared/lib/search-params';
import { cn } from '@/shared/lib/utils';
import { TableHead } from '@/shared/ui/table';

type Props = {
  field: SortField;
  label: string;
  className?: string;
};

export function SortableHeader({ field, label, className }: Props) {
  const [{ sortBy, sortDir }, setParams] = useQueryStates(usersSearchParamsParsers, {
    shallow: false,
  });

  const isActive = sortBy === field;
  const nextDir = isActive && sortDir === 'asc' ? 'desc' : 'asc';

  return (
    <TableHead
      className={cn(
        'group cursor-pointer whitespace-nowrap select-none',
        'hover:bg-muted/50 transition-colors duration-100',
        isActive ? 'text-primary' : 'text-muted-foreground',
        className,
      )}
      onClick={() => void setParams({ sortBy: field, sortDir: nextDir, page: 1 })}
    >
      <span className="flex items-center gap-1 text-xs font-semibold tracking-wide uppercase">
        {label}
        <span
          className={cn(
            'text-xs',
            isActive
              ? 'text-primary'
              : 'text-muted-foreground/40 group-hover:text-muted-foreground/60',
          )}
        >
          {isActive ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </TableHead>
  );
}
