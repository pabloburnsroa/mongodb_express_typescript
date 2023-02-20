import { NextFunction, Request, Response } from 'express';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) return res.sendStatus(403);
  // if next() is called here, user is on the response object
  return next();
};

export default requireUser;
