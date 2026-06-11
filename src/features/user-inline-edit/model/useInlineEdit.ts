'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/shared/api/trpc-react';
import type { User } from '@/entities/user';

export function useInlineEdit(user: User) {
  const [displayEmail, setDisplayEmail] = useState(user.email);
  const [editValue, setEditValue] = useState(user.email);
  const [isEditing, setIsEditing] = useState(false);
  const prevEmailRef = useRef(user.email);

  // Sync display when server returns fresh user data (navigation)
  useEffect(() => {
    if (!isEditing) {
      setDisplayEmail(user.email);
      setEditValue(user.email);
    }
  }, [user.id, user.email, isEditing]);

  const mutation = trpc.users.update.useMutation({
    onMutate: (input) => {
      prevEmailRef.current = displayEmail;
      setDisplayEmail(input.email);
    },
    onSuccess: (data) => {
      setDisplayEmail(data.email);
    },
    onError: (_err) => {
      setDisplayEmail(prevEmailRef.current);
      toast.error('Failed to update email', { description: _err.message });
    },
  });

  const startEdit = () => {
    setEditValue(displayEmail);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditValue(displayEmail);
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!isEditing) return;
    setIsEditing(false);
    if (editValue.trim() === displayEmail) return;
    mutation.mutate({ id: user.id, email: editValue.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return {
    displayEmail,
    editValue,
    setEditValue,
    isEditing,
    startEdit,
    saveEdit,
    handleKeyDown,
    isPending: mutation.isPending,
  };
}
