import { SpaceRepository } from '../db/space.db.js';
import { hashToken } from '../utils/hash.js';
import { SpaceSettings } from '../types/space.js';
import { generateRandomToken } from '../utils/generateToken.js';
import { Perms } from '../types/perms.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';

const spaceRepo = new SpaceRepository();
const settingsCache = new Map<string, SpaceSettings>();

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
        expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        settings: {
            public_upload: false, 
            password_protected: false, 
            download_allowed: true 
        } as SpaceSettings
    });

    settingsCache.set(space.id, space.settings);
    const token = generateToken({
        spaceId: space.id,
        type: 'ADMIN',
        capabilities: [Perms.READ, Perms.UPLOAD, Perms.DELETE, Perms.CONFIG]
    });

    return { space, token };
  }

  async exchangeShareCode(code: string) {
    const space = await spaceRepo.findByShareCode(code);
    if (!space) throw new Error('Invalid Code');
    
    if (new Date(space.expires_at) < new Date()) {
        throw new Error('Space Expired');
    }

    if (space.settings.password_protected) {
        return { 
            space, 
            locked: true, 
            token: null
        };
    }
    
    const token = generateToken({ 
        spaceId: space.id, 
        type: 'VIEWER', 
        capabilities: [Perms.READ]
    });

    return { space, locked: false, token };
  }

  async verifySpacePassword(spaceId: string, passwordInput: string) {
    const space = await spaceRepo.findById(spaceId);
    if (!space || !space.password_hash) throw new Error('Space not found or not locked');

    const isValid = await verifyPassword(passwordInput, space.password_hash);
    if (!isValid) throw new Error('Incorrect Password');

    const token = generateToken({ 
        spaceId: space.id, 
        type: 'VIEWER', 
        capabilities: [Perms.READ]
    });

    return { token };
  }

  async updateSpaceSettings(spaceId: string, updates: any, passwordArg?: string) {

    const passwordInput = passwordArg || updates.password;
    const currentSettings = await this.getSpaceSettings(spaceId);
        const newSettings: SpaceSettings = {
      public_upload: updates.public_upload ?? currentSettings.public_upload,
      download_allowed: updates.download_allowed ?? currentSettings.download_allowed, 
      password_protected: updates.password_protected ?? currentSettings.password_protected,
    };

    let newPasswordHash = undefined;

    if (updates.password_protected === true && passwordInput) {
        newPasswordHash = await hashPassword(passwordInput);
    } 
    else if (updates.password_protected === false) {
        newPasswordHash = null;
    }

    const promises: Promise<any>[] = [
        spaceRepo.updateSettings(spaceId, newSettings)
    ];

    if (newPasswordHash !== undefined) {
        promises.push(spaceRepo.updatePassword(spaceId, newPasswordHash));
    }

    await Promise.all(promises);
    settingsCache.set(spaceId, newSettings);

    return newSettings;
  }

  async getSpaceSettings(spaceId: string) {
    if (settingsCache.has(spaceId)) {
        return settingsCache.get(spaceId)!;
    }

    const settings = await spaceRepo.getSettings(spaceId);
    if (!settings) throw new Error('Space not found');
    
    settingsCache.set(spaceId, settings);
    return settings;
  }

  async getSpaceDetails(spaceId: string) {
    return await spaceRepo.findById(spaceId);
  }

  async deleteSpace(spaceId: string) {
    const paths = await spaceRepo.getFilePaths(spaceId);
    if (paths.length > 0) {
      await spaceRepo.deleteFilesFromStorage(paths);
    }
    settingsCache.delete(spaceId);
    
    return await spaceRepo.delete(spaceId);
  }

  async createShareLink(spaceId: string) {
    const currentPublicId = await spaceRepo.getPublicId(spaceId);
    if (currentPublicId) return currentPublicId;
    
    const publicId = generateRandomToken(10); 
    await spaceRepo.updatePublicId(spaceId, publicId);
    return publicId;
  }

  async trackVisit(spaceId: string) {
    spaceRepo.incrementVisitCount(spaceId).catch(err => {
        console.error("Failed to track visit:", err);
    });
    return { success: true };
  }
}