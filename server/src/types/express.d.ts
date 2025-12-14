import { Space } from './space.js';
import { TokenType } from './perms.js';

declare global {
  namespace Express {
    interface Request {
      currentSpace?: {
        id: string;
        capabilities: Perms[];
        tokenType: string;
      };

      user?: {
        spaceId: string;
        type: TokenType;
        capabilities: Perms[];
      };
    }
  }
}

export {};