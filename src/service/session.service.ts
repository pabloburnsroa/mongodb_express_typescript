import { FilterQuery, UpdateQuery } from 'mongoose';
import SessionModel, { ISession } from '../models/session.model';
import { signJWT, verifyJWT } from '../utils/jwt.utils';
import { get } from 'lodash';
import { findUser } from './user.service';

export async function createSession(userId: string, userAgent?: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toObject();
}

export async function findSessions(query: FilterQuery<ISession>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<ISession>,
  update: UpdateQuery<ISession>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  // check if refresh token is valid
  const { decoded } = verifyJWT(refreshToken);
  console.log({ decoded });
  // check if decoded or no _id in decoded object
  if (!decoded || !get(decoded, 'session')) return false;
  const session = await SessionModel.findById(get(decoded, 'session'));
  // check if session or session is tagged as valid
  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_TTL }
  );

  return accessToken;
}
