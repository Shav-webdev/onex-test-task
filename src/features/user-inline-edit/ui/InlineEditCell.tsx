'use client';

import { useInlineEdit } from '../model/useInlineEdit';
import type { User } from '@/entities/user';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { TableCell } from '@/shared/ui/table';
import { Pencil } from 'lucide-react';

type Props = {
  user: User;
};

export function InlineEditCell({ user }: Props) {
  const {
    displayEmail,
    editValue,
    setEditValue,
    isEditing,
    startEdit,
    saveEdit,
    handleKeyDown,
    isPending,
  } = useInlineEdit(user);

  if (isEditing) {
    return (
      <TableCell>
        <Input
          autoFocus
          type="email"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="border-ring bg-accent/30"
        />
      </TableCell>
    );
  }

  return (
    <TableCell>
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={startEdit}
        title="Click to edit email"
        className="h-auto px-1 py-0.5 -ml-1 justify-start text-sm font-normal text-foreground"
      >
        {displayEmail}
        <Pencil className="size-3 text-muted-foreground/40 group-hover/button:text-primary/60 shrink-0" />
      </Button>
    </TableCell>
  );
}
