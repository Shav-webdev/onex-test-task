import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs/server';

export const PAGE_SIZE = 10;

export const SORT_FIELDS = ['firstName', 'email', 'age'] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export const SORT_DIRS = ['asc', 'desc'] as const;
export type SortDir = (typeof SORT_DIRS)[number];

export const usersSearchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  sortBy: parseAsStringLiteral(SORT_FIELDS).withDefault('firstName'),
  sortDir: parseAsStringLiteral(SORT_DIRS).withDefault('asc'),
  filter: parseAsString.withDefault(''),
};

export const searchParamsCache = createSearchParamsCache(usersSearchParamsParsers);
