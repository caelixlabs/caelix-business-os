export interface StoredRefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface RefreshTokenRepository {
  create(params: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;

  findByHash(tokenHash: string): Promise<StoredRefreshToken | null>;

  findActiveByUserId(userId: string): Promise<StoredRefreshToken | null>;

  revoke(id: string): Promise<void>;

  /** Revokes every outstanding refresh token for a user (e.g. logout-all, password change). */
  revokeAllForUser(userId: string): Promise<void>;

  revokeAllByUserId(userId: String): Promise<void>;
}
