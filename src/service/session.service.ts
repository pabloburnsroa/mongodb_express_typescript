import SessionModel from '../models/session.model';

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ userId: userId, userAgent });

  return session.toJSON();
}
