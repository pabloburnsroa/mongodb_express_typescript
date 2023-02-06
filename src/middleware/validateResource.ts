import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

// validate middleware will validate the request against the schema provided.
// E.g. making sure required fields are present when creating a new user and making sure they are of correct types.

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return res.status(400).send(e.errors);
    }
  };

export default validate;
