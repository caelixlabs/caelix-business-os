export type AutomationActionType = 'NOTIFY_ADMINS' | 'SEND_EMAIL_TO_CONTACT' | 'SEND_SMS_TO_CONTACT' | 'SEND_WHATSAPP_TO_CONTACT';

export interface AutomationTrigger {
  key: string;
  label: string;
  description: string;
  variables: string[];
  canEmailContact: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: string;
  conditions: { field: string; equals: string }[] | null;
  actionType: AutomationActionType;
  actionConfig: Record<string, string>;
  runCount: number;
  lastRunAt: string | null;
  createdAt: string;
}

export const ACTION_LABELS: Record<AutomationActionType, string> = {
  NOTIFY_ADMINS: 'Notify admins',
  SEND_EMAIL_TO_CONTACT: 'Email the contact',
  SEND_SMS_TO_CONTACT: 'Text the contact (SMS)',
  SEND_WHATSAPP_TO_CONTACT: 'WhatsApp the contact',
};
