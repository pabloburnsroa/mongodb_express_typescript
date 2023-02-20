import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, Express } from 'express';
import connect from './db/connect';
import log from './utils/logger';
import morgan from 'morgan';
import routes from './routes/routes';
import createServer from './utils/server';

const port = process.env.PORT;
const app = createServer();

app.listen(port, async () => {
  log.info(`[server]: Server is running at http://localhost:${port}`);
  await connect();
  routes(app);
});
