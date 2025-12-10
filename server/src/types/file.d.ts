export interface FileMeta {
  id: string;
  spaceId: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  canDownload: boolean;
  selfDestructViews?: number | null;
}
