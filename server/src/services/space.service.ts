import { supabase } from '../config/SupabaseClient';
import { TokenService } from './token.service';
import { hashToken } from '../utils/hash';
import { SpaceSettings } from '../types/space';

const tokenService = new TokenService();

export class SpaceService {
  
  async createAnonymousSpace(deviceIp: string) {
    const ipHash = hashToken(deviceIp);

    const { data: existingSpace } = await supabase
      .from('spaces')
      .select('id, expires_at')
      .eq('creator_ip_hash', ipHash)
      .maybeSingle();

    if (existingSpace) {
        const now = new Date();
        const expiresAt = new Date(existingSpace.expires_at);

        if (expiresAt > now) {
            throw new Error('You already have an active space. Delete it first.');
        } else {
            console.log(`[Lazy Cleanup] Removing expired space ${existingSpace.id} for returning user.`);
            await this.deleteSpace(existingSpace.id);
        }
    }

    const { data: space, error } = await supabase
      .from('spaces')
      .insert({
        creator_ip_hash: ipHash,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        settings: {
            public_upload: false, 
            password_protected: false, 
            download_allowed: true 
        } as SpaceSettings
      })
      .select()
      .single();

    if (error) throw error;

    const tokens = await tokenService.createSpaceTokens(space.id);

    return { space, tokens };
  }

  async getSpaceDetails(spaceId: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('id', spaceId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteSpace(spaceId: string) {
    const { data: files } = await supabase.from('files').select('storage_path').eq('space_id', spaceId);
    
    if (files && files.length > 0) {
      const paths = files.map(f => f.storage_path);
      await supabase.storage.from('tempspace_files').remove(paths);
    }
    const { error } = await supabase.from('spaces').delete().eq('id', spaceId);
    if (error) throw error;
    
    return true;
  }
}