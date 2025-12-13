import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service.js';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const fileService = new FileService();

export const uploadFileProxy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return; 
    }

    const result = await fileService.uploadFile(req.currentSpace!.id, req.file);
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