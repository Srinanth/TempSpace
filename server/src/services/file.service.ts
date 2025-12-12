import { supabase } from '../config/SupabaseClient.js'; // Adjust path/extension if needed
import { STORAGE_CONFIG } from '../config/storage.js'; // Assumes you created this in the audit step
import { File } from '../types/file.js';
export class FileService {
  
  async generateUploadUrl(spaceId: string, filename: string, sizeBytes: number) {
    const { data: space } = await supabase
      .from('spaces')
      .select('file_count')
      .eq('id', spaceId)
      .single();

    if (!space || space.file_count >= STORAGE_CONFIG.MAX_FILES_PER_SPACE) {
      throw new Error('File limit reached (Max 20)');
    }

    if (sizeBytes > STORAGE_CONFIG.MAX_FILE_SIZE) {
      throw new Error('File too large (Max 50MB)');
    }

    const storagePath = `${spaceId}/${Date.now()}_${filename}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .createSignedUploadUrl(storagePath);

    if (error) throw error;

    return { 
      uploadUrl: data.signedUrl, 
      path: data.path,
      token: data.token 
    };
  }


  async saveFileRecord(spaceId: string, meta: { filename: string, storagePath: string, sizeBytes: number, mimeType: string }) {
    const { data, error } = await supabase.from('files').insert({
      space_id: spaceId,
      filename: meta.filename,
      storage_path: meta.storagePath,
      size_bytes: meta.sizeBytes,
      mime_type: meta.mimeType
    }).select().single();

    if (error) throw error;

    await supabase.rpc('increment_space_usage', { 
        row_id: spaceId, 
        size_inc: meta.sizeBytes, 
        count_inc: 1 
    });

    return data as File;
  }


  async listFiles(spaceId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('space_id', spaceId);
      
    if (error) throw error;
    return data as File[];
  }


  async generateDownloadLink(spaceId: string, fileId: string) {
    const { data: space } = await supabase
      .from('spaces')
      .select('settings')
      .eq('id', spaceId)
      .single();

    if (!space || space.settings?.download_allowed === false) {
      const error: any = new Error('Downloads are disabled for this space');
      error.status = 403;
      throw error;
    }

    const { data: file } = await supabase
      .from('files')
      .select('storage_path, filename')
      .eq('id', fileId)
      .eq('space_id', spaceId)
      .single();

    if (!file) {
      const error: any = new Error('File not found');
      error.status = 404;
      throw error;
    }

    const { data: signedData, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .createSignedUrl(file.storage_path, STORAGE_CONFIG.URL_EXPIRY, { 
        download: file.filename 
      });

    if (error) throw error;

    await supabase.rpc('increment_download_count', { row_id: fileId });

    return { downloadUrl: signedData.signedUrl, filename: file.filename };
  }
}