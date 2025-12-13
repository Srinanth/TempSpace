import { supabase } from '../config/SupabaseClient.js';
import { STORAGE_CONFIG } from '../config/storage.js';
import { Space } from '../types/space.js'; 

const generateCode = () => Math.random().toString(36).substring(2, 6).toUpperCase();

export class SpaceRepository {
  
  async findByIpHash(ipHash: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('id, expires_at')
      .eq('creator_ip_hash', ipHash)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data; 
  }

  async create(data: Partial<Space>) {
    const code = generateCode();
    
    const { data: space, error } = await supabase
      .from('spaces')
      .insert({ ...data, share_code: code })
      .select()
      .single();

    if (error) throw error;
    return space as Space;
  }

  async findByShareCode(code: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('share_code', code)
      .single();

    if (error) return null;
    return data as Space;
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Space;
  }

  async getPublicId(id: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('public_id')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data?.public_id;
  }

  async updatePublicId(id: string, publicId: string) {
    const { error } = await supabase
      .from('spaces')
      .update({ public_id: publicId })
      .eq('id', id);

    if (error) throw error;
  }

  async getFilePaths(spaceId: string) {
    const { data } = await supabase
      .from('files')
      .select('storage_path')
      .eq('space_id', spaceId);
      
    return data ? data.map(f => f.storage_path) : [];
  }

  async deleteFilesFromStorage(paths: string[]) {
    if (paths.length === 0) return;
    const { error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .remove(paths);
      
    if (error) throw error;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async getUsage(id: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('file_count, total_size_bytes, settings') 
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}

