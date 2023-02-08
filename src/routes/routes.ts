import { Express, Request, Response } from 'express';
import { createUserHandler } from '../controllers/user.controller';
import validate from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { createUserSessionHandler } from '../controllers/session.controller';
import { createSessionSchema } from '../schema/session.schema';
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
}

export default routes;
