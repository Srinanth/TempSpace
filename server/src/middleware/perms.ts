import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service.js';
import { Perms } from '../types/perms.js';
import { supabase } from '../config/SupabaseClient.js';

const tokenService = new TokenService();

declare global {
  namespace Express {
    interface Request {
      currentSpace?: {
        id: string;
        capabilities: Perms[];
        tokenType: string;
      };
    }
  }
}
async function checkPublicAccess(publicId: string) {
    const { data } = await supabase
        .from('spaces')
        .select('id, expires_at')
        .eq('public_id', publicId)
        .single();
    
    if (data && new Date(data.expires_at) > new Date()) {
        return data.id;
    }
    return null;
}
export const requirePerms = (requiredCap: Perms) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const publicIdHeader = req.headers['x-public-id'] as string;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const rawToken = authHeader.split(' ')[1];
        if (!rawToken) return res.status(401).json({ error: 'Malformed token' });

        const payload = await tokenService.verifyToken(rawToken);
        
        if (!payload) return res.status(403).json({ error: 'Invalid or expired token' });

        if (!payload.capabilities.includes(requiredCap)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        req.currentSpace = {
          id: payload.spaceId,
          capabilities: payload.capabilities,
          tokenType: payload.type
        };
        return next();
      }

      else if (publicIdHeader) {
        if (requiredCap !== Perms.READ) {
            return res.status(403).json({ error: 'Public links are Read-Only' });
        }

        const spaceId = await checkPublicAccess(publicIdHeader);
        if (!spaceId) {
            return res.status(404).json({ error: 'Invalid or expired share link' });
        }

        req.currentSpace = {
            id: spaceId,
            capabilities: [Perms.READ],
            tokenType: 'PUBLIC_LINK'
        };
        return next();
      }

      return res.status(401).json({ error: 'Missing token or valid public link' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};