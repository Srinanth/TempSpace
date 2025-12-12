export interface File {
  id: string;
  space_id: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: Date;
}