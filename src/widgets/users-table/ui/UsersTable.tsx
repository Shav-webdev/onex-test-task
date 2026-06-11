'use client';

import type { User } from '@/entities/user';
import { SortableHeader } from '@/features/users-sort';
import { InlineEditCell } from '@/features/user-inline-edit';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

type Props = {
  users: User[];
};

export function UsersTable({ users }: Props) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="firstName" label="Name" />
            <TableHead className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
              Email
              <span className="ml-1 text-muted-foreground/60 font-normal normal-case tracking-normal">
                (click to edit)
              </span>
            </TableHead>
            <SortableHeader field="age" label="Age" className="w-20" />
            <TableHead className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
              Phone
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <InlineEditCell user={user} />
              <TableCell className="tabular-nums text-muted-foreground">{user.age}</TableCell>
              <TableCell className="text-muted-foreground">{user.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
