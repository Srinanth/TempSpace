export interface SpaceSettings {
  public_upload: boolean;
  password_protected: boolean;
  download_allowed: boolean;
}

export interface Space {
  id: string;
  creator_ip_hash: string;
  share_code: string;
  settings: SpaceSettings;
  total_size_bytes: number;
  file_count: number;
  expires_at: string;
  created_at: string;
  password_hash?: string;
}