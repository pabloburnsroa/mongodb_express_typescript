import express from 'express';
import client from 'prom-client';
import log from './logger';

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

export const databaseRsponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'db response time in seconds',
  labelNames: ['operation', 'success'],
});

export default function metricsServer() {
  // Default metrics
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  // Endpoint for metrics
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    return res.send(await client.register.metrics());
  });

  app.listen(9100, () => {
    log.info(`Metrics server is running on http://localhost:9100`);
  });
}
