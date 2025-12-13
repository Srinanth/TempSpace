import { generateToken, verifyToken } from '../utils/jwt.js';
import { Perms, TokenPayload } from '../types/perms.js';

export class TokenService {

  async createSpaceTokens(spaceId: string) {
    return {
      admin: generateToken({ 
        spaceId, 
        type: 'ADMIN',
        capabilities: [Perms.READ, Perms.UPLOAD, Perms.DELETE, Perms.CONFIG] 
      }),
      uploader: generateToken({ 
        spaceId, 
        type: 'UPLOADER',
        capabilities: [Perms.READ, Perms.UPLOAD] 
      }),
      viewer: generateToken({ 
        spaceId, 
        type: 'VIEWER',
        capabilities: [Perms.READ] 
      })
    };
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      return verifyToken(token);
    } catch (error) {
      return null;
    }
  }
}