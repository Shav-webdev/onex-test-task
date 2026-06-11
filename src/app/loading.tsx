import { UsersTableSkeleton } from '@/widgets/users-table';

export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse, filter, and edit user records.
        </p>
      </div>
      <div className="mb-4 h-9 w-72 rounded-md bg-muted animate-pulse" />
      <UsersTableSkeleton />
    </main>
  );
}
