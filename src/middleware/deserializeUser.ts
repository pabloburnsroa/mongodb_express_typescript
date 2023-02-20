import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { verifyJWT } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../service/session.service';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/Bearer\s/, '');

  const refreshToken =
    get(req, 'cookies.refreshToken') ||
    (get(req, 'headers.x-refresh') as string);

  if (!accessToken) return next();

  const { decoded, expired } = verifyJWT(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);

      res.cookie('accessToken', newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        // dev env only - change to
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        // In production, set to true so can only be used over https
        secure: false,
      });
    }

    const result = verifyJWT(newAccessToken as string);
    res.locals.user = result.decoded;
    return next();
  }

  return next();
};
