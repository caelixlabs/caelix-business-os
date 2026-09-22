export type MessageChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';
export type MessageStatus = 'SENT' | 'FAILED' | 'LOGGED';

export const CHANNEL_LABELS: Record<MessageChannel, string> = {
  EMAIL: 'Email',
  SMS: 'SMS',
  WHATSAPP: 'WhatsApp',
};

export interface Message {
  id: string;
  channel: MessageChannel;
  toAddress: string;
  subject: string | null;
  body: string;
  status: MessageStatus;
  error: string | null;
  source: string;
  createdAt: string;
  contact: { id: string; firstName?: string; lastName?: string; companyName?: string } | null;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject: string | null;
  body: string;
}
