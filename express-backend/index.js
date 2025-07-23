import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(bodyParser.json());

/**
 * Import routes
 */

import helloworldRoutes from './routes/helloworld.js';
import dbActionRoutes from './routes/db-actions.js';
import albumRoutes from './routes/albums.js';
import photoRoutes from './routes/photos.js';
import userRoutes from './routes/users.js';

/**
 * Mount routes
 */

app.use('/helloworld', helloworldRoutes);
app.use('/db-actions', dbActionRoutes);
app.use('/albums', albumRoutes);
app.use('/photos', photoRoutes);
app.use('/users', userRoutes);

/**
 * Launch app
 */

app.listen(8091, () => {
  console.log('Backend listening on http://localhost:8091');
});