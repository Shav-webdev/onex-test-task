'use client';

import { useQueryStates } from 'nuqs';
import { usersSearchParamsParsers } from '@/shared/lib/search-params';
import { Button } from '@/shared/ui/button';

type Props = {
  total: number;
  pageCount: number;
};

export function UsersPagination({ total, pageCount }: Props) {
  const [{ page }, setParams] = useQueryStates(usersSearchParamsParsers, { shallow: false });

  const goTo = (p: number) => void setParams({ page: p });

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-muted-foreground">
        {total} {total === 1 ? 'user' : 'users'} total
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ‹
        </Button>

        {buildPageRange(page, pageCount).map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="px-2 text-muted-foreground text-sm select-none">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'ghost'}
              size="icon-sm"
              onClick={() => goTo(p)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => goTo(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          ›
        </Button>
      </nav>
    </div>
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
