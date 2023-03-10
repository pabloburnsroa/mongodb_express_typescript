import { CookieOptions, Request, Response } from 'express';
import {
  findAndUpdateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  validatePassword,
} from '../service/user.service';
import {
  createSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import { signJWT } from '../utils/jwt.utils';
import log from '../utils/logger';

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  // dev env only - change to
  domain: 'localhost',
  path: '/',
  sameSite: 'lax',
  // In production, set to true so can only be used over https
  secure: false,
};

const refreshTokenCookieOptions: CookieOptions = {
  maxAge: 3.154e10, // 1 year
  httpOnly: true,
  // dev env only - change to
  domain: 'localhost',
  path: '/',
  sameSite: 'lax',
  // In production, set to true so can only be used over https
  secure: false,
};

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
  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

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

export async function googleOauthHandler(req: Request, res: Response) {
  const code = req.query.code as string;
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    // console.log({ id_token, access_token });
    // GET USER TOKENS
    const googleUser = await getGoogleUser({ id_token, access_token });

    // console.log({ googleUser });
    // VERIFY EMAIL
    if (!googleUser.verified_email) {
      return res.status(403).send('Google accound is not verified');
    }
    // UPSERT USER
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    );
    // console.log(user);
    // CREATE SESSION
    const session = await createSession(user!._id, req.get('user-agent') || '');
    // CREATE ACCESS TOKEN
    const accessToken = signJWT(
      { ...user?.toJSON(), session: session._id },
      { expiresIn: process.env.ACCESS_TOKEN_TTL }
    );
    // CREATE REFRESH TOKEN
    const refreshToken = signJWT(
      { ...user?.toJSON(), session: session._id },
      { expiresIn: process.env.REFRESH_TOKEN_TTL }
    );
    // SET COOKIES
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    // REDIRECT
    res.redirect(`${process.env.ORIGIN}`);
  } catch (error) {
    log.error(error, 'Failed to authorize Google user');
    return res.redirect(`${process.env.ORIGIN}/oauth/error`);
  }
}
