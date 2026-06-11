'use client';

import { useQueryStates } from 'nuqs';
import { usersSearchParamsParsers } from '@/shared/lib/search-params';
import { cn } from '@/shared/lib/cn';

type Props = {
  total: number;
  pageCount: number;
};

export function UsersPagination({ total, pageCount }: Props) {
  const [{ page }, setParams] = useQueryStates(usersSearchParamsParsers);

  const goTo = (p: number) => void setParams({ page: p });

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-gray-500">
        {total} {total === 1 ? 'user' : 'users'} total
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <PageButton
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ‹
        </PageButton>

        {buildPageRange(page, pageCount).map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="px-2 text-gray-400 text-sm select-none">
              …
            </span>
          ) : (
            <PageButton key={p} active={p === page} onClick={() => goTo(p)}>
              {p}
            </PageButton>
          ),
        )}

        <PageButton
          onClick={() => goTo(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          ›
        </PageButton>
      </nav>
    </div>
  );
}

type PageButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  'aria-label'?: string;
};

function PageButton({ children, onClick, disabled, active, 'aria-label': ariaLabel }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'min-w-[2rem] h-8 rounded-lg px-2 text-sm font-medium transition-colors',
        active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100',
        (disabled) && 'pointer-events-none opacity-40',
      )}
    >
      {children}
    </button>
  );
}

function buildPageRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result: (number | 'ellipsis')[] = [1];

  if (current - 1 > 2) result.push('ellipsis');

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    result.push(p);
  }

  if (current + 1 < total - 1) result.push('ellipsis');

  result.push(total);

  return result;
}
