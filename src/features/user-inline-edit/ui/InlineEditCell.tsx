'use client';

import { cn } from '@/shared/lib/cn';
import { useInlineEdit } from '../model/useInlineEdit';
import type { User } from '@/entities/user';
import type { RouterInputs } from '@/shared/api/trpc-react';

type Props = {
  user: User;
  queryInput: RouterInputs['users']['list'];
};

export function InlineEditCell({ user, queryInput }: Props) {
  const {
    editValue,
    setEditValue,
    isEditing,
    startEdit,
    saveEdit,
    handleKeyDown,
    error,
    isPending,
  } = useInlineEdit(user, queryInput);

  if (isEditing) {
    return (
      <td className="px-4 py-2">
        <input
          autoFocus
          type="email"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded border px-2 py-1 text-sm',
            'border-blue-400 bg-blue-50',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
          )}
        />
      </td>
    );
  }

  return (
    <td className="px-4 py-2">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          disabled={isPending}
          onClick={startEdit}
          className={cn(
            'text-left text-sm text-gray-700 rounded px-1 py-0.5 -ml-1',
            'hover:bg-blue-50 hover:text-blue-700 transition-colors group',
            'flex items-center gap-1 cursor-pointer',
            isPending && 'opacity-50 cursor-not-allowed',
            error && 'text-red-600',
          )}
          title="Click to edit email"
        >
          {user.email}
          <svg
            className="w-3 h-3 text-gray-300 group-hover:text-blue-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        {error && <p className="text-xs text-red-500 leading-tight">{error}</p>}
      </div>
    </td>
  );
}
