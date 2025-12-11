export enum Perms {
  READ = 'READ',
  UPLOAD = 'UPLOAD',
  DELETE = 'DELETE',
  CONFIG = 'CONFIG'
}

export type TokenType = 'ADMIN' | 'UPLOADER' | 'VIEWER';

export interface TokenPayload {
  spaceId: string;
  type: TokenType;
  capabilities: Perms[];
}