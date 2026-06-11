'use client';

import { useEffect, useRef, useState } from 'react';
import { trpc, type RouterInputs } from '@/shared/api/trpc-react';
import type { User } from '@/entities/user';

type UsersListInput = RouterInputs['users']['list'];

export function useInlineEdit(user: User, queryInput: UsersListInput) {
  const utils = trpc.useUtils();

  const [editValue, setEditValue] = useState(user.email);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevValueRef = useRef(user.email);

  // Stay in sync with external data changes (e.g. after invalidation)
  useEffect(() => {
    if (!isEditing) setEditValue(user.email);
  }, [user.email, isEditing]);

  const mutation = trpc.users.update.useMutation({
    onMutate: async (updated) => {
      prevValueRef.current = user.email;
      await utils.users.list.cancel(queryInput);
      const prev = utils.users.list.getData(queryInput);

      utils.users.list.setData(queryInput, (old) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.map((u) =>
            u.id === updated.id ? { ...u, email: updated.email } : u,
          ),
        };
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        utils.users.list.setData(queryInput, ctx.prev);
      }
      setEditValue(prevValueRef.current);
      setError(_err.message);
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    },
    onSettled: () => {
      void utils.users.list.invalidate(queryInput);
    },
  });

  const startEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const cancelEdit = () => {
    setEditValue(user.email);
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!isEditing) return;
    setIsEditing(false);
    if (editValue.trim() === user.email) return;
    mutation.mutate({ id: user.id, email: editValue.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return {
    editValue,
    setEditValue,
    isEditing,
    startEdit,
    cancelEdit,
    saveEdit,
    handleKeyDown,
    error,
    isPending: mutation.isPending,
  };
}
