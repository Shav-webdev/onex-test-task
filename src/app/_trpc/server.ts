import 'server-only';
import { cache } from 'react';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { appRouter, type AppRouter } from '@/server';
import { createCallerFactory } from '@/server/trpc';
import { makeQueryClient } from '@/shared/api/query-client';

export const getQueryClient = cache(makeQueryClient);

const createCaller = createCallerFactory(appRouter);
const caller = createCaller({});

export const { trpc: serverTrpc, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getQueryClient);
