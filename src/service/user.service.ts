import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import User, { IUser, UserModel } from '../models/user.model';
import { omit } from 'lodash';
import axios from 'axios';
import qs from 'qs';
import log from '../utils/logger';

/**
 Service layer = business logic 
 */

// Create User
export async function createUser(
  input: Omit<IUser, 'createdAt' | 'updatedAt' | 'picture'>
) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), 'password');
  } catch (e: any) {
    throw new Error(e);
  }
}

// Valide User Password
export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // Look for user in DB
  const user = await User.findOne({ email });
  // Return error/false if no user
  if (!user) return false;
  // Check for valid password
  const isPasswordValid = await user.checkPassword(password);
  if (!isPasswordValid) return false;
  return omit(user.toObject(), 'password');
}

export async function findUser(query: FilterQuery<IUser>) {
  return User.findOne(query).lean();
}

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: 'authorization_code',
  };

  // console.log(values);

  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    // Google responds to this request by returning a JSON object that contains a short-lived access token and a refresh token.
    // console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.error(error);
    log.error(error, 'Failed to fetch Google Oauth Tokens');
    throw new Error(error.message);
  }
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    log.error(error, `There was an error fetching google user`);
    throw new Error(error.message);
  }
}

export async function findAndUpdateUser(
  query: FilterQuery<IUser>,
  update: UpdateQuery<IUser>,
  options: QueryOptions = {}
) {
  return User.findOneAndUpdate(query, update, options);
}
