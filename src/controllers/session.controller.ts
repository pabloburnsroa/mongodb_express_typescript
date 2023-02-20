import { Request, Response } from 'express';
import { validatePassword } from '../service/user.service';
import {
  createSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import { signJWT } from '../utils/jwt.utils';

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate user w/ password
  const user = await validatePassword(req.body);
  if (!user) return res.status(401).send('Invalid email or password');

  // if user valid, create session
  const session = await createSession(user._id, req.get('user-agent') || '');
  // create access token
  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_TTL }
  );
  // create refresh token
  const refreshToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: process.env.REFRESH_TOKEN_TTL }
  );

  // Set cookies
  res.cookie('accessToken', accessToken, {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    // dev env only - change to
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    // In production, set to true so can only be used over https
    secure: false,
  });
  res.cookie('refreshToken', refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
    // dev env only - change to
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    // In production, set to true so can only be used over https
    secure: false,
  });

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
