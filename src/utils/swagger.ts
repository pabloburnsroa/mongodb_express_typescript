import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import log from './logger';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'REST API',
    version: '1.0.0',
  },
  components: {
    securitySchemas: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/schema/*.ts'],
};

const openapiSpecification = swaggerJsdoc(options);

export default function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  // Docs in JSON format
  app.get('docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openapiSpecification);
  });

  log.info(`Docs available at http://localhost:${port}/docs`);
}
