import cron from 'node-cron';
import { CleanupService } from '../services/cleanup.service.js';

const cleanupService = new CleanupService();

export const startCleanupJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      await cleanupService.removeExpiredSpaces();
    } catch (error) {
      console.error('CRON ERROR:', error);
    }
  });
  
  console.log('🕒 Cleanup Job scheduled (runs hourly).');
};