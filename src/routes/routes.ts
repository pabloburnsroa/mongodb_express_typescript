import { Express, Request, Response } from 'express';
import {
  createUserHandler,
  getCurrentUser,
} from '../controllers/user.controller';
import validate from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
  googleOauthHandler,
} from '../controllers/session.controller';
import { createSessionSchema } from '../schema/session.schema';
import requireUser from '../middleware/requireUser';

function routes(app: Express) {
  /**
   * @openapi
   * /checkstatus:
   *  get:
   *    tags:
   *    - Checkstatus
   *    description: Responds if the app is up and runnning
   *    responses:
   *      200:
   *        description: App is running
   */
  app.get('/checkstatus', (req: Request, res: Response) => res.sendStatus(200));

  /**
   * @openapi
   * '/api/users':
   *  post:
   *    tags:
   *    - User
   *    summary: Register a new user
   *    description: Responds if new user is registered
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateUserInput'
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *
   *
   */
  app.post('/api/users', validate(createUserSchema), createUserHandler);

  // CREATE SESSION
  app.post(
    '/api/sessions',
    validate(createSessionSchema),
    createUserSessionHandler
  );

  // GET SESSIONS
  app.get('/api/sessions', requireUser, getUserSessionsHandler);

  // DELETE SESSION
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  // GET USER
  app.get('/api/me', requireUser, getCurrentUser);

  // GOOGLE AUTH
  app.get('/api/sessions/oauth/google', googleOauthHandler);
}

export default routes;
