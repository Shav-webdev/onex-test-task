'use client';

import type { User } from '@/entities/user';
import { SortableHeader } from '@/features/users-sort';
import { InlineEditCell } from '@/features/user-inline-edit';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

type Props = {
  users: User[];
};

export function UsersTable({ users }: Props) {
  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="firstName" label="Name" />
            <TableHead className="text-xs font-semibold tracking-wide whitespace-nowrap uppercase">
              Email
              <span className="text-muted-foreground/60 ml-1 font-normal tracking-normal normal-case">
                (click to edit)
              </span>
            </TableHead>
            <SortableHeader field="age" label="Age" className="w-20" />
            <TableHead className="text-xs font-semibold tracking-wide whitespace-nowrap uppercase">
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
              <TableCell className="text-muted-foreground tabular-nums">{user.age}</TableCell>
              <TableCell className="text-muted-foreground">{user.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
