export interface Space {
  id: string;
  ownerId: string | null; // could be null cause there are no login users
  createdAt: string;
  expiresAt: string;
  isShared: boolean;
  passwordHash?: string | null;
  viewLimit?: number | null;
  viewsUsed?: number;
  maxFiles: number;             // 5 guest, 20 user
  fileUploadLimitMB: number;    // 10 guest, 50 user
}
