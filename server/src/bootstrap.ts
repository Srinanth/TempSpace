import { startCleanupJob } from './config/cron.js';
import { validateEnv } from './utils/ENVvalidate.js';

export const bootstrap = async () => {
    validateEnv();
  console.log('🚀 System starting up...');

  startCleanupJob();
  
  console.log('✅ Background services initialized.');
};