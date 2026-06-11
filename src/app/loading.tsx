import { UsersTableSkeleton } from '@/widgets/users-table';

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1 text-sm">Browse, filter, and edit user records.</p>
      </div>
      <div className="bg-muted mb-4 h-9 w-72 animate-pulse rounded-md" />
      <UsersTableSkeleton />
    </main>
  );
}
