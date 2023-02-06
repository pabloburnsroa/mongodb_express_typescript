import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import connect from './db/connect';
import log from './utils/logger';
import morgan from 'morgan';
import routes from './routes/routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(morgan('combined'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World! TypeScript Server is running...');
});

app.listen(port, async () => {
  log.info(`[server]: Server is running at http://localhost:${port}`);
  await connect();
  routes(app);
});
