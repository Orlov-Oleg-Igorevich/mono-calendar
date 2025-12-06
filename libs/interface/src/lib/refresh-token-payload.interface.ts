export interface IRefreshTokenPayload {
  userId: string;
  iat: number;
  deviceFingerprint: string;
}
