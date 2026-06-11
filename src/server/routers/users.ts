import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { DummyJsonUsersResponseSchema, UserUpdateInputSchema } from '@/entities/user';
import { SORT_FIELDS, SORT_DIRS } from '@/shared/lib/search-params';
import { router, publicProcedure } from '../trpc';

const DUMMY_JSON_BASE = 'https://dummyjson.com';

const usersListInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(SORT_FIELDS).optional(),
  sortDir: z.enum(SORT_DIRS).optional(),
  filter: z.string().optional(),
});

export const usersRouter = router({
  list: publicProcedure.input(usersListInput).query(async ({ input }) => {
    const { page, limit, sortBy, sortDir, filter } = input;
    const skip = (page - 1) * limit;

    let url: string;
    if (filter?.trim()) {
      url = `${DUMMY_JSON_BASE}/users/search?q=${encodeURIComponent(filter.trim())}&limit=${limit}&skip=${skip}&select=id,firstName,lastName,email,age,phone`;
    } else {
      const sort = sortBy ? `&sortBy=${sortBy}&order=${sortDir ?? 'asc'}` : '';
      url = `${DUMMY_JSON_BASE}/users?limit=${limit}&skip=${skip}${sort}&select=id,firstName,lastName,email,age,phone`;
    }

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch users from the data source.',
      });
    }

    const raw: unknown = await res.json();
    const parsed = DummyJsonUsersResponseSchema.parse(raw);
    let { users } = parsed;

    // DummyJSON /search does not support server-side sorting — sort in procedure
    if (filter?.trim() && sortBy) {
      users = [...users].sort((a, b) => {
        const cmp =
          sortBy === 'age' ? a.age - b.age : String(a[sortBy]).localeCompare(String(b[sortBy]));
        return sortDir === 'desc' ? -cmp : cmp;
      });
    }

    return {
      users,
      total: parsed.total,
      page,
      pageCount: Math.max(1, Math.ceil(parsed.total / limit)),
    };
  }),

  update: publicProcedure.input(UserUpdateInputSchema).mutation(async ({ input }) => {
    // Simulate network latency
    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    // Simulate a 30 % server-side failure to demonstrate error recovery
    if (Math.random() < 0.3) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error — your change was not saved. Please try again.',
      });
    }

    return input;
  }),
});
