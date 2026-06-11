type Props = {
  message?: string;
  onRetry: () => void;
};

export function UsersTableError({
  message = 'Failed to load users.',
  onRetry,
}: Props) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      <p className="mt-1 text-xs text-red-500">
        Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
