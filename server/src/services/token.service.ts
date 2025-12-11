import { supabase } from '../config/SupabaseClient.js';
import { generateRandomToken } from '../utils/generateToken.js';
import { hashToken } from '../utils/hash.js';
import { TokenType, Perms } from '../types/perms.js';

export class TokenService {
  async createSpaceTokens(spaceId: string) {
    const adminRaw = generateRandomToken();
    const uploaderRaw = generateRandomToken();
    const viewerRaw = generateRandomToken();

    const tokensToInsert = [
      { space_id: spaceId, type: 'ADMIN', token_hash: hashToken(adminRaw) },
      { space_id: spaceId, type: 'UPLOADER', token_hash: hashToken(uploaderRaw) },
      { space_id: spaceId, type: 'VIEWER', token_hash: hashToken(viewerRaw) }
    ];

    const { error } = await supabase.from('tokens').insert(tokensToInsert);
    if (error) throw error;

    return {
      admin: adminRaw,
      uploader: uploaderRaw,
      viewer: viewerRaw
    };
  }


  async verifyToken(rawToken: string) {
    const hash = hashToken(rawToken);
    
    const { data, error } = await supabase
      .from('tokens')
      .select('space_id, type')
      .eq('token_hash', hash)
      .single();

    if (error || !data) return null;

    return {
      spaceId: data.space_id,
      type: data.type as TokenType
    };
  }

  getCapabilities(type: TokenType): Perms[] {
    switch (type) {
      case 'ADMIN':
        return [Perms.READ, Perms.UPLOAD, Perms.DELETE, Perms.CONFIG];
      case 'UPLOADER':
        return [Perms.UPLOAD]; 
      case 'VIEWER':
        return [Perms.READ];
      default:
        return [];
    }
  }
}