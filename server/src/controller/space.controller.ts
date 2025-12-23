import { NextFunction, Request, Response } from 'express';
import { SpaceService } from '../services/space.service.js';

const spaceService = new SpaceService();

export const createSpace = async (req: Request, res: Response) => {
  try {
    const ip = req.ip || 'anonymous';
    const result = await spaceService.createAnonymousSpace(ip);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpace = async (req: Request, res: Response) => {
  try {
    const spaceId = req.currentSpace!.id; 
    const space = await spaceService.getSpaceDetails(spaceId);
    
    if (new Date(space.expires_at) < new Date()) {
       return res.status(404).json({ error: 'Space expired' });
    }

    res.json(space);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSpace = async (req: Request, res: Response) => {
  try {
    const spaceId = req.currentSpace!.id;
    await spaceService.deleteSpace(spaceId);
    res.json({ message: 'Space deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spaceId = req.currentSpace!.id;
    const newSettings = await spaceService.updateSpaceSettings(spaceId, req.body);

    res.json({ message: 'Settings updated', settings: newSettings });
  } catch (error) {
    next(error);
  }
};

export const createPublicLink = async (req: Request, res: Response) => {
  try {
    const spaceId = req.currentSpace!.id;
    const publicId = await spaceService.createShareLink(spaceId);
    
    res.json({ publicId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const joinSpace = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { code } = req.body;
    const result = await spaceService.exchangeShareCode(code);
    res.json(result);
  } catch (error) { next(error); }
};

export const joinSpaceProxy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    const result = await spaceService.exchangeShareCode(code);
    
    res.json(result); 
  } catch (error) { next(error); }
};

export const unlockSpaceProxy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { spaceId, password } = req.body;
    const result = await spaceService.verifySpacePassword(spaceId, password);
    res.json(result);
  } catch (error) { next(error); }
};

export const updateSettingsProxy = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { password, ...settings } = req.body;
      
      await spaceService.updateSpaceSettings(
          req.currentSpace!.id, 
          settings, 
          password
      );
      
      res.json({ success: true });
  } catch (err) { next(err); }
}

export const trackVisit = async (req: Request, res: Response) => {
  try {
    const spaceId = req.currentSpace!.id;
    await spaceService.trackVisit(spaceId);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.json({ success: false });
  }
};