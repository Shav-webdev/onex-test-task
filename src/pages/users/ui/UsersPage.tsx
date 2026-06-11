'use client';

import { useQueryStates } from 'nuqs';
import { usersSearchParamsParsers, PAGE_SIZE } from '@/shared/lib/search-params';
import { trpc } from '@/shared/api/trpc-react';
import { UsersFilter } from '@/features/users-filter';
import {
  UsersTable,
  UsersTableSkeleton,
  UsersTableError,
  UsersPagination,
} from '@/widgets/users-table';

export function UsersPage() {
  const [params] = useQueryStates(usersSearchParamsParsers);

  const queryInput = {
    page: params.page,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
    filter: params.filter || undefined,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isError, error, refetch } =
    trpc.users.list.useQuery(queryInput);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse, filter, and edit user records.
        </p>
      </div>

      <div className="mb-4">
        <UsersFilter />
      </div>

      {isLoading && <UsersTableSkeleton />}

      {isError && (
        <UsersTableError
          message={error?.message}
          onRetry={() => void refetch()}
        />
      )}

      {data && (
        <>
          <UsersTable users={data.users} queryInput={queryInput} />
          <UsersPagination total={data.total} pageCount={data.pageCount} />
        </>
      )}
    </main>
  );
}
