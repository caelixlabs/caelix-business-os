export type SignatureStatus = 'PENDING' | 'SIGNED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';

export interface SignatureRequest {
  id: string;
  title: string;
  body: string;
  bodyHash: string;
  signerName: string;
  signerEmail: string;
  status: SignatureStatus;
  expiresAt: string;
  signedAt: string | null;
  signedName: string | null;
  signerIp: string | null;
  declineReason: string | null;
  createdAt: string;
}

export interface PublicSignatureView {
  title: string;
  body: string;
  signerName: string;
  organizationName: string;
  status: SignatureStatus;
  expiresAt: string;
  signedAt: string | null;
  signedName: string | null;
  bodyHash: string;
}
