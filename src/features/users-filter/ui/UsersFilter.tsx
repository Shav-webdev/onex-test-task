'use client';

import { useQueryStates } from 'nuqs';
import { Search } from 'lucide-react';
import { usersSearchParamsParsers } from '@/shared/lib/search-params';
import { useDebounce } from '@/shared/lib/useDebounce';
import { Input } from '@/shared/ui/input';

const DEBOUNCE_MS = 350;

export function UsersFilter() {
  const [{ filter }, setParams] = useQueryStates(usersSearchParamsParsers, { shallow: false });

  const [inputValue, handleChange] = useDebounce(
    filter,
    (value) => void setParams({ filter: value, page: 1 }),
    DEBOUNCE_MS,
  );

  return (
    <div className="relative w-72">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search by name or email…"
        className="pl-8"
      />
    </div>
  );
}
