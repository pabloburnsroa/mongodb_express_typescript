/**
 User endpoints
 createUserSchema will validate data passed to the createUserHandler controller


 zod 
 .refine(validator: (data:T)=>any, params?: RefineParams)
 */

import { TypeOf, object, string } from 'zod';

type RefineParams = {
  message?: string;
  path?: (string | number)[];
};

export const createUserSchema = object({
  // Definition for the payload
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password should be a minimum of 6 characters'),
    passwordConfirmation: string({
      required_error: 'Password is required',
    }).min(6, 'Password should be a minimum of 6 characters'),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
