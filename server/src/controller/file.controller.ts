import { Request, Response } from 'express';
import { supabase } from '../config/SupabaseClient.js';

export const getUploadUrl = async (req: Request, res: Response) => {
  try {
    const { filename, sizeBytes } = req.body;
    const spaceId = req.currentSpace!.id;

    const { data: space } = await supabase.from('spaces').select('file_count').eq('id', spaceId).single();
    if (!space || space.file_count >= 20) {
      return res.status(400).json({ error: 'File limit reached (Max 20)' });
    }
    if (sizeBytes > 50 * 1024 * 1024) { // 50MB
      return res.status(400).json({ error: 'File too large (Max 50MB)' });
    }

    const storagePath = `${spaceId}/${Date.now()}_${filename}`;

    // Create Signed Upload URL
    const { data, error } = await supabase
      .storage
      .from('tempspace_files')
      .createSignedUploadUrl(storagePath);

    if (error) throw error;

    res.json({ 
      uploadUrl: data.signedUrl, 
      path: data.path,
      token: data.token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmUpload = async (req: Request, res: Response) => {
  try {
    const { filename, storagePath, sizeBytes, mimeType } = req.body;
    const spaceId = req.currentSpace!.id;

    const { data, error } = await supabase.from('files').insert({
      space_id: spaceId,
      filename,
      storage_path: storagePath,
      size_bytes: sizeBytes,
      mime_type: mimeType
    }).select().single();

    if (error) throw error;

    await supabase.rpc('increment_space_usage', { 
        row_id: spaceId, 
        size_inc: sizeBytes, 
        count_inc: 1 
    });

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listFiles = async (req: Request, res: Response) => {
    try {
        const spaceId = req.currentSpace!.id;
        const { data, error } = await supabase.from('files').select('*').eq('space_id', spaceId);
        if(error) throw error;
        res.json(data);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}