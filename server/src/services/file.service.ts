import { FileRepository } from '../db/file.db.js';
import { SpaceRepository } from '../db/space.db.js';
import { STORAGE_CONFIG } from '../config/storage.js';
import { File } from '../types/file.js';
import { Readable } from 'stream';

const fileRepo = new FileRepository();
const spaceRepo = new SpaceRepository();

export class FileService {
  
async uploadFileStream(
      spaceId: string, 
      fileStream: Readable, 
      metadata: { filename: string; mimeType: string; sizeEstimate: number }
  ) {
    const space = await spaceRepo.getUsage(spaceId);
    if (!space) throw new Error('Space not found');

    const currentSize = space.total_size_bytes || 0;
    const newSize = currentSize + metadata.sizeEstimate;

    if (newSize > STORAGE_CONFIG.MAX_SPACE_SIZE) {
      const remaining = (STORAGE_CONFIG.MAX_SPACE_SIZE - currentSize) / (1024 * 1024);
      fileStream.resume(); 
      throw new Error(`Space full! You have ${remaining.toFixed(2)} MB left.`);
    }

    const cleanFilename = metadata.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${spaceId}/${Date.now()}_${cleanFilename}`; 

    const uploadData = await fileRepo.upload(storagePath, fileStream, metadata.mimeType);

    return await this.saveFileRecord(spaceId, {
      filename: metadata.filename,
      storagePath: uploadData.path,
      sizeBytes: metadata.sizeEstimate,
      mimeType: metadata.mimeType
    });
  }

  async saveFileRecord(spaceId: string, meta: { filename: string, storagePath: string, sizeBytes: number, mimeType: string }): Promise<File> {
    const file = await fileRepo.create({
      space_id: spaceId,
      filename: meta.filename,
      storage_path: meta.storagePath,
      size_bytes: meta.sizeBytes,
      mime_type: meta.mimeType
    });

    await fileRepo.incrementSpaceUsage(spaceId, meta.sizeBytes);
    return file; 
  }

  async listFiles(spaceId: string): Promise<File[]> {
    return await fileRepo.findBySpaceId(spaceId);
  }

  async deleteFile(spaceId: string, fileId: string) {
    const file = await fileRepo.findById(fileId, spaceId);
    if (!file) throw new Error('File not found');
    
    await fileRepo.deleteFromStorage(file.storage_path);
    await fileRepo.delete(fileId);
    await fileRepo.decrementSpaceUsage(spaceId, file.size_bytes);
    return true;
  }

  async generatePreviewLink(spaceId: string, fileId: string) {
    const file = await fileRepo.findById(fileId, spaceId);
    if (!file) throw new Error('File not found');

    const signedData = await fileRepo.createSignedPreviewUrl(file.storage_path);

    return { 
      previewUrl: signedData.signedUrl, 
      filename: file.filename, 
      mimeType: file.mime_type 
    };
  }

  async getFileStream(spaceId: string, fileId: string) {
    const space = await spaceRepo.getUsage(spaceId);
    
    if (!space || (space.settings && space.settings.download_allowed === false)) {
      throw new Error('Downloads are currently LOCKED by the host.');
    }

    const file = await fileRepo.findById(fileId, spaceId);
    if (!file) throw new Error('File not found');

    const fileBlob = await fileRepo.downloadStream(file.storage_path);
    await fileRepo.incrementDownloadCount(fileId);

    return { 
      stream: fileBlob.stream(), 
      filename: file.filename, 
      mimeType: file.mime_type, 
      size: file.size_bytes 
    };
  }
}