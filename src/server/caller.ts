import 'server-only';
import { cache } from 'react';
import { appRouter } from './router';
import { createCallerFactory } from './trpc';

const makeServerCaller = createCallerFactory(appRouter);

export const getServerCaller = cache(() => makeServerCaller({}));
