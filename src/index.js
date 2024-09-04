import setupServer from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { ensureDirExists } from './utils/ensureDirExists.js';
import path from 'node:path';
import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await ensureDirExists(TEMP_UPLOAD_DIR);
    await ensureDirExists(path.resolve(UPLOAD_DIR));
    setupServer();
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    process.exit(1); 
  }
};

bootstrap();
