import mongoose from 'mongoose';
import * as UserService from '../service/user.service';
import supertest from 'supertest';
import createServer from '../utils/server';

const app = createServer();

// Sample user input data
const userInput = {
  email: 'test@example.com',
  name: 'Jane Doe',
  password: 'Password123456',
  passwordConfirmation: 'Password123456',
};

const userId = new mongoose.Types.ObjectId().toString();

// Sample user return payload
const userPayload = {
  _id: userId,
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

describe('user', () => {
  // User Registration
  describe('given the user and password are valid', () => {
    it('should return the user payload', async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockReturnValueOnce(userPayload);

      const { statusCode, body } = await supertest(app)
        .post('/api/users')
        .send(userInput);
      expect(statusCode).toBe(200);
      expect(body).toEqual(userPayload);
      expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
    });
  });
  describe('given the passwords do not match', () => {
    it('should return a 400', () => {});
  });
  describe('given the user service throws', () => {
    it('should return a 409 error', () => {});
  });

  // User Session
  describe('create user session', () => {
    describe('given username and password are valid', () => {
      it('should return a signed accessToken & refresh token', () => {});
    });
  });
});
