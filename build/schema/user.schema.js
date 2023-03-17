"use strict";
/**
 User endpoints
 createUserSchema will validate data passed to the createUserHandler controller


 zod
 .refine(validator: (data:T)=>any, params?: RefineParams)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    // Definition for the payload
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: 'Name is required',
        }),
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(6, 'Password should be a minimum of 6 characters'),
        passwordConfirmation: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(6, 'Password should be a minimum of 6 characters'),
        email: (0, zod_1.string)({
            required_error: 'Email is required',
        }).email('Not a valid email'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
    }),
});
