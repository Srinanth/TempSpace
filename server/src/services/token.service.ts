import { generateToken, verifyToken } from '../utils/jwt.js';
import { Perms, TokenPayload } from '../types/perms.js';

export class TokenService {

  createAdminToken(spaceId: string): string {
    return generateToken({ 
      spaceId, 
      type: 'ADMIN',
      capabilities: [Perms.READ, Perms.UPLOAD, Perms.DELETE, Perms.CONFIG] 
    });
  }

  createGuestToken(spaceId: string, role:'VIEWER'): string {
    const capabilities = [Perms.READ];

    return generateToken({
        spaceId,
        type: role,
        capabilities
    });
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      return verifyToken(token);
    } catch (error) {
      return null;
    }
  }
}