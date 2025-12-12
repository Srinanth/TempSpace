import { supabase } from '../config/SupabaseClient.js';
import { SpaceService } from './space.service.js';

const spaceService = new SpaceService();

export class CleanupService {
  
  async removeExpiredSpaces() {
    console.log('[Checking for expired spaces...');
    
    const { data: expiredSpaces, error } = await supabase
      .from('spaces')
      .select('id')
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error fetching spaces:', error.message);
      return;
    }

    if (!expiredSpaces || expiredSpaces.length === 0) {
      console.log('No expired spaces found.');
      return;
    }

    console.log(`Found ${expiredSpaces.length} expired spaces. Deleting...`);

    for (const space of expiredSpaces) {
      try {
        await spaceService.deleteSpace(space.id);
        console.log(`Deleted Space: ${space.id}`);
      } catch (err) {
        console.error(`Failed to delete ${space.id}:`, err);
      }
    }
    
    console.log('Cleanup Complete.');
  }
}