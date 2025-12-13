import { supabase } from '../config/SupabaseClient.js';
import { STORAGE_CONFIG } from '../config/storage.js';
import { File } from '../types/file.js';

export class FileRepository {

  async findBySpaceId(spaceId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('space_id', spaceId);
      
    if (error) throw error;
    return data as File[];
  }

  async findById(fileId: string, spaceId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('space_id', spaceId)
      .single();

    if (error) throw error;
    return data as File;
  }

  async create(data: Partial<File>) {
    const { data: file, error } = await supabase
      .from('files')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return file as File;
  }

  async createSignedUploadUrl(storagePath: string) {
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .createSignedUploadUrl(storagePath);

    if (error) throw error;
    return data;
  }

  async createSignedDownloadUrl(storagePath: string, filename: string) {
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .createSignedUrl(storagePath, STORAGE_CONFIG.URL_EXPIRY, {
        download: filename,
      });

    if (error) throw error;
    return data;
  }

  async incrementSpaceUsage(spaceId: string, sizeBytes: number) {
    const { error } = await supabase.rpc('increment_space_usage', { 
        row_id: spaceId, 
        size_inc: sizeBytes, 
        count_inc: 1 
    });
    if (error) throw error;
  }

  async incrementDownloadCount(fileId: string) {
    const { error } = await supabase.rpc('increment_download_count', { row_id: fileId });
    if (error) throw error;
  }

  async delete(fileId: string) {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (error) throw error;
  }

  async deleteFromStorage(storagePath: string) {
    const { error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .remove([storagePath]);

    if (error) throw error;
  }

  async decrementSpaceUsage(spaceId: string, sizeBytes: number) {
    const { error } = await supabase.rpc('increment_space_usage', { 
        row_id: spaceId, 
        size_inc: -sizeBytes,
        count_inc: -1
    });
    if (error) throw error;
  }

  async createSignedPreviewUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .createSignedUrl(storagePath, STORAGE_CONFIG.URL_EXPIRY);

  if (error) throw error;
  return data;
 }

 async upload(storagePath: string, fileBuffer: Buffer, mimeType: string) {
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) throw error;
    return data;
  }

  async downloadStream(storagePath: string) {
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .download(storagePath);

    if (error) throw error;
    return data;
  }
}
