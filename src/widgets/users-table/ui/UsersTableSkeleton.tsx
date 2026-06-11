import { cn } from '@/shared/lib/cn';

const SKELETON_ROWS = 10;
const COLUMNS = ['Name', 'Email', 'Age', 'Phone'] as const;

function SkeletonCell({ className }: { className?: string }) {
  return (
    <td className="px-4 py-3">
      <div className={cn('h-4 rounded bg-gray-200 animate-pulse', className)} />
    </td>
  );
}

export function UsersTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <tr key={i}>
              <SkeletonCell className="w-32" />
              <SkeletonCell className="w-48" />
              <SkeletonCell className="w-8" />
              <SkeletonCell className="w-28" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
