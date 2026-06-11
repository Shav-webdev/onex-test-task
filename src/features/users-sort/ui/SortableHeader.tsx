'use client';

import { useQueryStates } from 'nuqs';
import { usersSearchParamsParsers, type SortField } from '@/shared/lib/search-params';
import { cn } from '@/shared/lib/cn';

type Props = {
  field: SortField;
  label: string;
  className?: string;
};

export function SortableHeader({ field, label, className }: Props) {
  const [{ sortBy, sortDir }, setParams] = useQueryStates(usersSearchParamsParsers);

  const isActive = sortBy === field;
  const nextDir = isActive && sortDir === 'asc' ? 'desc' : 'asc';

  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide',
        'cursor-pointer select-none whitespace-nowrap group',
        'hover:bg-gray-100 transition-colors duration-100',
        isActive ? 'text-blue-600' : 'text-gray-500',
        className,
      )}
      onClick={() => void setParams({ sortBy: field, sortDir: nextDir, page: 1 })}
    >
      <span className="flex items-center gap-1">
        {label}
        <span
          className={cn(
            'text-xs',
            isActive ? 'text-blue-500' : 'text-gray-300 group-hover:text-gray-400',
          )}
        >
          {isActive ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  );
}
