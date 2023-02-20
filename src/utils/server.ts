import express from 'express';
import cors from 'cors';
import routes from '../routes/routes';
import morgan from 'morgan';
import { deserializeUser } from '../middleware/deserializeUser';
import cookieParser from 'cookie-parser';

const allowedOrigins = process.env.ORIGIN;
console.log(allowedOrigins);
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
console.log(options);

function createServer() {
  const app = express();
  app.use(cors(options));
  app.use(cookieParser());
  app.use(express.json());
  app.use(deserializeUser);
  app.use(morgan('combined'));

  return app;
}

export default createServer;
