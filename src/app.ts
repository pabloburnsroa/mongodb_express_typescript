import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, Express } from 'express';
import connect from './db/connect';
import log from './utils/logger';
import morgan from 'morgan';
import routes from './routes/routes';
import createServer from './utils/server';

import metricsServer, { restResponseTimeHistogram } from './utils/metrics';
import responseTime from 'response-time';

const port = process.env.PORT;
const app = createServer();

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

app.listen(port, async () => {
  log.info(`[server]: Server is running at http://localhost:${port}`);
  await connect();
  routes(app);
  metricsServer();
});
