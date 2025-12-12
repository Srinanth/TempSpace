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
      .from('TempSpace')
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

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const spaceId = req.currentSpace!.id;
    const fileId = req.params.fileId;

    const { data: space } = await supabase
      .from('spaces')
      .select('settings')
      .eq('id', spaceId)
      .single();

    if (!space || space.settings?.download_allowed === false) {
      return res.status(403).json({ error: 'Downloads are disabled for this space' });
    }

    const { data: file } = await supabase
      .from('files')
      .select('storage_path, filename')
      .eq('id', fileId)
      .eq('space_id', spaceId)
      .single();

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const { data: signedData, error } = await supabase
      .storage
      .from('TempSpace')
      .createSignedUrl(file.storage_path, 3600, {
        download: file.filename
      });

    if (error) throw error;
    await supabase.rpc('increment_download_count', { row_id: fileId });

    res.json({ downloadUrl: signedData.signedUrl, filename: file.filename });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};