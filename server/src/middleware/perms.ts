import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service.js';
import { SpaceService } from '../services/space.service.js';
import { Perms } from '../types/perms.js';
import { supabase } from '../config/SupabaseClient.js';

const tokenService = new TokenService();
const spaceService = new SpaceService();

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

        req.currentSpace = {
          id: payload.spaceId,
          capabilities: payload.capabilities,
          tokenType: payload.type
        };

        req.user = {
          spaceId: payload.spaceId,
          type: payload.type,
          capabilities: payload.capabilities
        };

        if (payload.capabilities.includes(requiredCap)) {
            return next();
        }

        if (requiredCap === Perms.UPLOAD) {
            const settings = await spaceService.getSpaceSettings(payload.spaceId);
            
            if (settings.public_upload) {
                return next();
            } else {
                return res.status(403).json({ error: 'Host has disabled uploads.' });
            }
        }

        return res.status(403).json({ error: 'Insufficient permissions' });
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
            tokenType: 'VIEWER'
        };
        
        req.user = {
            spaceId: spaceId,
            type: 'VIEWER',
            capabilities: [Perms.READ]
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