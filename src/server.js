import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import contactRoutes from './routers/contacts.js';
import userRoutes from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the Contacts API',
    });
  });


  app.use('/auth', userRoutes);
  app.use('/contacts', contactRoutes);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};

export default setupServer;
