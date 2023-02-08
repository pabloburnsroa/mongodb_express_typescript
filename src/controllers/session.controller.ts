import { Request, Response } from 'express';
import { validatePassword } from '../service/user.service';
import { createSession } from '../service/session.service';
import { signJWT } from '../utils/jwt.utils';

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate user w/ password
  const user = await validatePassword(req.body);
  // console.log(user);
  if (!user) return res.status(401).send('Invalid email or password');

  // if user valid, create session
  const session = await createSession(user._id, req.get('user-agent') || '');
  // console.log(session);
  // create access token
  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_TTL }
  );
  // console.log(accessToken);
  // create refresh token
  const refreshToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: process.env.REFRESH_TOKEN_TTL }
  );

  return res.send({ accessToken, refreshToken });
}
