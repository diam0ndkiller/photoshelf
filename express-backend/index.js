import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

/**
 * Import routes
 */

import helloworldRoutes from './routes/helloworld.js';

/**
 * Mount routes
 */

app.use('/', helloworldRoutes);

/**
 * Launch app
 */

app.listen(8091, () => {
  console.log('Backend listening on http://localhost:8091');
});