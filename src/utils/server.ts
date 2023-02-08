import express from 'express';
import routes from '../routes/routes';
import morgan from 'morgan';

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(morgan('combined'));
  routes(app);
  return app;
}

export default createServer;
