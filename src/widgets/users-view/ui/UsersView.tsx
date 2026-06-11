import type { User } from '@/entities/user';
import { UsersFilter } from '@/features/users-filter';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { UsersTable, UsersPagination } from '@/widgets/users-table';

type Props = {
  users: User[];
  total: number;
  pageCount: number;
};

export function UsersView({ users, total, pageCount }: Props) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse, filter, and edit user records.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-4">
        <UsersFilter />
      </div>

      <UsersTable users={users} />
      <UsersPagination total={total} pageCount={pageCount} />
    </main>
  );
}
