export type TokenType = 'ADMIN' | 'UPLOADER' | 'VIEWER';
export interface TokenResponse {
  admin: string;
  uploader: string;
  viewer: string;
}