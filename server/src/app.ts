import express from 'express';
import cors from 'cors';
import spaceRoutes from './routes/space.routes.js';
import fileRoutes from './routes/file.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (_req, res) => {
  res.send('TempSpace API is running');
});

export default app;