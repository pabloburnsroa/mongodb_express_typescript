/**
 User endpoints
 createUserSchema will validate data passed to the createUserHandler controller


 zod 
 .refine(validator: (data:T)=>any, params?: RefineParams)
 */

import { TypeOf, object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: john.doe@email.com
 *        name:
 *          type: string
 *          default: John Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

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
