import { NextFunction, Request, Response } from 'express';
import { SpaceService } from '../services/space.service.js';
import { SpaceSettings } from '../types/space.js';
import { supabase } from '../config/SupabaseClient.js';

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

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const spaceId = req.currentSpace!.id;
    const { public_upload, download_allowed, password_protected } = req.body;

    const { data: currentSpace } = await supabase
      .from('spaces')
      .select('settings')
      .eq('id', spaceId)
      .single();

    if (!currentSpace) return res.status(404).json({ error: 'Space not found' });

    const newSettings: SpaceSettings = {
      ...currentSpace.settings,
      ...(public_upload !== undefined && { public_upload }),
      ...(download_allowed !== undefined && { download_allowed }),
      ...(password_protected !== undefined && { password_protected }),
    };

    const { data, error } = await supabase
      .from('spaces')
      .update({ settings: newSettings })
      .eq('id', spaceId)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Settings updated', settings: data.settings });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
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