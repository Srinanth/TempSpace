import express from 'express';
import cors from 'cors';
import spaceRoutes from './routes/space.routes.js';
import fileRoutes from './routes/file.routes.js';
import { errorHandler } from './middleware/error.js';
import { globalLimiter } from './config/ratelimiter.js';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: 'https://tempspace.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-public-id'],
  exposedHeaders: ['x-public-id']
}));
app.use(express.json());
app.use(globalLimiter);

// Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (_req, res) => {
  res.send('TempSpace API is running');
});

app.use(errorHandler);
export default app;