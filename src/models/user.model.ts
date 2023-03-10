import { Schema, model, connect, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface representing a user doc in mongoDB
export interface IUser {
  name: string;
  email: string;
  password: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  checkPassword(password: string): Promise<Boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, unique: true },
    picture: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Validate user that attempts to login
userSchema.method(
  'checkPassword',
  async function checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password).catch((e) => false);
  }
);

// Pre middleware function - hashing the password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Hash password and replace the text password with hashed password within DB
  const salt = Number(process.env.SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
