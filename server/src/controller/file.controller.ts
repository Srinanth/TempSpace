import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service.js';

const fileService = new FileService();

export const getUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename, sizeBytes } = req.body;
    const result = await fileService.generateUploadUrl(req.currentSpace!.id, filename, sizeBytes);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const confirmUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileService.saveFileRecord(req.currentSpace!.id, req.body);
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
    const spaceId = req.currentSpace!.id;
        const fileId = req.params.fileId as string; 

    if (!fileId) {
       res.status(400).json({ error: 'Missing file ID' });
       return;
    }

    const result = await fileService.generateDownloadLink(spaceId, fileId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};