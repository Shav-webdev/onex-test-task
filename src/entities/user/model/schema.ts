import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  age: z.number(),
  phone: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const DummyJsonUsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const UserUpdateInputSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export type UserUpdateInput = z.infer<typeof UserUpdateInputSchema>;
