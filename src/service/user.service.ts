import { FilterQuery } from 'mongoose';
import User, { IUser, UserModel } from '../models/user.model';
import { omit } from 'lodash';

/**
 Service layer = business logic 
 */

// Create User
export async function createUser(
  input: Omit<IUser, 'createdAt' | 'updatedAt'>
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
