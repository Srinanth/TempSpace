import { SpaceRepository } from '../db/space.db.js';
import { TokenService } from './token.service.js';
import { hashToken } from '../utils/hash.js';
import { SpaceSettings } from '../types/space.js';
import { generateRandomToken } from '../utils/generateToken.js';
import { Perms } from '../types/perms.js';
import { generateToken } from '../utils/jwt.js';

const spaceRepo = new SpaceRepository();
const tokenService = new TokenService();

export class SpaceService {
  
  async createAnonymousSpace(deviceIp: string) {
    const ipHash = hashToken(deviceIp);

    const existingSpace = await spaceRepo.findByIpHash(ipHash);

    if (existingSpace) {
        const now = new Date();
        const expiresAt = new Date(existingSpace.expires_at);

        if (expiresAt > now) {
            throw new Error('You already have an active space. Delete it first.');
        } else {
            console.log(`Removing expired space ${existingSpace.id}`);
            await this.deleteSpace(existingSpace.id);
        }
    }

    const space = await spaceRepo.create({
        creator_ip_hash: ipHash,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        settings: {
            public_upload: false, 
            password_protected: false, 
            download_allowed: true 
        } as SpaceSettings
    });

    const tokens = await tokenService.createSpaceTokens(space.id);

    return { space, tokens };
  }

  async getSpaceDetails(spaceId: string) {
    return await spaceRepo.findById(spaceId);
  }

  async deleteSpace(spaceId: string) {
    const paths = await spaceRepo.getFilePaths(spaceId);
    if (paths.length > 0) {
      await spaceRepo.deleteFilesFromStorage(paths);
    }
    return await spaceRepo.delete(spaceId);
  }

  async createShareLink(spaceId: string) {
    const currentPublicId = await spaceRepo.getPublicId(spaceId);
    if (currentPublicId) return currentPublicId;

    const publicId = generateRandomToken(10); 

    await spaceRepo.updatePublicId(spaceId, publicId);
    
    return publicId;
  }

  async exchangeShareCode(code: string) {
    const space = await spaceRepo.findByShareCode(code);
    if (!space) throw new Error('Invalid Code');
    if (new Date(space.expires_at) < new Date()) throw new Error('Space Expired');

    const tokens = {
      uploader: generateToken({ 
          spaceId: space.id, 
          type: 'UPLOADER', 
          capabilities: [Perms.READ, Perms.UPLOAD] 
      }),
      viewer: generateToken({ 
          spaceId: space.id, 
          type: 'VIEWER', 
          capabilities: [Perms.READ] 
      }),
    };
    return { space, tokens };
  }
}