import { searchParamsCache, PAGE_SIZE } from '@/shared/lib/search-params';
import { getServerCaller } from '@/server';
import { UsersView } from '@/pages/users';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = searchParamsCache.parse(await searchParams);

  const { users, total, pageCount } = await getServerCaller().users.list({
    page: params.page,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
    filter: params.filter || undefined,
    limit: PAGE_SIZE,
  });

  return <UsersView users={users} total={total} pageCount={pageCount} />;
}
