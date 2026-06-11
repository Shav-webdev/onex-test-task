'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryStates } from 'nuqs';
import { usersSearchParamsParsers } from '@/shared/lib/search-params';
import { cn } from '@/shared/lib/cn';

const DEBOUNCE_MS = 350;

export function UsersFilter() {
  const [{ filter }, setParams] = useQueryStates(usersSearchParamsParsers);
  const [inputValue, setInputValue] = useState(filter);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep input in sync when URL changes externally (e.g. back/forward)
  useEffect(() => {
    setInputValue(filter);
  }, [filter]);

  const handleChange = (value: string) => {
    setInputValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void setParams({ filter: value, page: 1 });
    }, DEBOUNCE_MS);
  };

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search by name or email…"
        className={cn(
          'pl-9 pr-4 py-2 w-72 rounded-lg border border-gray-200 bg-white',
          'text-sm placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-shadow duration-150',
        )}
      />
    </div>
  );
}
