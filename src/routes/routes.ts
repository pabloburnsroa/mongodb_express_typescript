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
} from '../controllers/session.controller';
import { createSessionSchema } from '../schema/session.schema';
import requireUser from '../middleware/requireUser';
function routes(app: Express) {
  app.get('/checkstatus', (req: Request, res: Response) => res.sendStatus(200));

  // CREATE USER
  app.post('/api/users', validate(createUserSchema), createUserHandler);

  // CREATE SESSION
  app.post(
    '/api/sessions',
    validate(createSessionSchema),
    createUserSessionHandler
  );

  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  app.get('/api/me', requireUser, getCurrentUser);
}

export default routes;
