'use client';

import type { User } from '@/entities/user';
import type { RouterInputs } from '@/shared/api/trpc-react';
import { SortableHeader } from '@/features/users-sort';
import { InlineEditCell } from '@/features/user-inline-edit';

type Props = {
  users: User[];
  queryInput: RouterInputs['users']['list'];
};

export function UsersTable({ users, queryInput }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <SortableHeader field="firstName" label="Name" />
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
              Email
              <span className="ml-1 text-gray-400 font-normal normal-case tracking-normal">
                (click to edit)
              </span>
            </th>
            <SortableHeader field="age" label="Age" className="w-20" />
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
              Phone
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-75">
              <td className="px-4 py-3 font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </td>
              <InlineEditCell user={user} queryInput={queryInput} />
              <td className="px-4 py-3 text-gray-600 tabular-nums">{user.age}</td>
              <td className="px-4 py-3 text-gray-500">{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
