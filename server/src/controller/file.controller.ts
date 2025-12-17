import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service.js';
import { SpaceService } from '../services/space.service.js';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import busboy from 'busboy';

const fileService = new FileService();
const spaceService = new SpaceService();

export const uploadFileProxy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.type !== 'ADMIN') {
       const settings = await spaceService.getSpaceSettings(req.currentSpace!.id);
       if (!settings.public_upload) {
          return res.status(403).json({ error: 'Host has disabled uploads.' });
       }
    }

    const bb = busboy({ headers: req.headers });
    const uploadPromise = new Promise((resolve, reject) => {
        let fileUploaded = false;

        bb.on('file', async (_name, fileStream, info) => {
            fileUploaded = true;
            const sizeHeader = req.headers['content-length'];
            const sizeEstimate = sizeHeader ? parseInt(sizeHeader) : 0;

            try {
                const result = await fileService.uploadFileStream(
                    req.currentSpace!.id, 
                    fileStream, 
                    {
                        filename: info.filename,
                        mimeType: info.mimeType,
                        sizeEstimate
                    }
                );
                resolve(result);
            } catch (err) {
                fileStream.resume();
                reject(err);
            }
        });
        bb.on('error', (err) => reject(err));
        bb.on('close', () => {
            if (!fileUploaded) reject(new Error('No file uploaded'));
        });
    });
    req.pipe(bb);
    const result = await uploadPromise;
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};

export const listFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileService.listFiles(req.currentSpace!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileId = req.params.fileId;
    if (!fileId) {
      res.status(400).json({ error: 'File ID is required' });
      return;
    }

    const { stream, filename, mimeType, size } = await fileService.getFileStream(
      req.currentSpace!.id, 
      fileId
    );

    res.setHeader('Content-Type', mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', size);
    
    // @ts-ignore
    await pipeline(Readable.fromWeb(stream), res);
    
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.type !== 'ADMIN') {
        res.status(403).json({ error: 'Only the host can delete files.' });
        return;
    }
    const spaceId = req.currentSpace!.id;
    const fileId = req.params.fileId;

    if (!fileId) {
      res.status(400).json({ error: 'File ID is required' });
      return; 
    }

    await fileService.deleteFile(spaceId, fileId);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    next(error);
  }
};

export const previewFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spaceId = req.currentSpace!.id;
    const fileId = req.params.fileId;
    if (!fileId) {
      res.status(400).json({ error: 'File ID is required' });
      return;
    }

    const result = await fileService.generatePreviewLink(spaceId, fileId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};