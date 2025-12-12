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

      // Admin/Uploader/viewer
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const rawToken = authHeader.split(' ')[1];
        if (!rawToken) return res.status(401).json({ error: 'Malformed token' });

        const tokenData = await tokenService.verifyToken(rawToken);
        if (!tokenData) return res.status(403).json({ error: 'Invalid token' });

        const capabilities = tokenService.getCapabilities(tokenData.type);
        if (!capabilities.includes(requiredCap)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        req.currentSpace = {
          id: tokenData.spaceId,
          capabilities,
          tokenType: tokenData.type
        };
        return next();
      }

      // viewer
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