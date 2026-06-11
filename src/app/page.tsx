import { searchParamsCache, PAGE_SIZE } from '@/shared/lib/search-params';
import { serverTrpc, HydrateClient } from './_trpc/server';
import { UsersPage } from '@/pages/users';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = searchParamsCache.parse(await searchParams);

  await serverTrpc.users.list.prefetch({
    page: params.page,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
    filter: params.filter || undefined,
    limit: PAGE_SIZE,
  });

  return (
    <HydrateClient>
      <UsersPage />
    </HydrateClient>
  );
}
