import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';
import { Perms } from '../types/perms';

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

export const requirePerms = (requiredCap: Perms) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
      }

      const rawToken = authHeader.split(' ')[1];

      if (!rawToken) { 
        return res.status(401).json({ error: 'Malformed token' });
      }

      const tokenData = await tokenService.verifyToken(rawToken);

      if (!tokenData) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      const capabilities = tokenService.getCapabilities(tokenData.type);

      if (!capabilities.includes(requiredCap)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.currentSpace = {
        id: tokenData.spaceId,
        capabilities,
        tokenType: tokenData.type
      };

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};