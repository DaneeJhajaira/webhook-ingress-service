export type WhatsappOutboundStatus =
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'deleted'
  | 'warning'
  | 'unknown';

export interface WhatsappMessageStatusEvent {
  eventId: string;
  eventType: 'whatsapp.message.status';
  occurredAt: string;

  source: {
    channel: 'whatsapp';
    provider: 'meta';
    phoneNumberId: string;
    displayPhoneNumber: string;
  };

  message: {
    messageId: string;
    status: WhatsappOutboundStatus;
    timestamp: string;
  };

  recipient: {
    waId: string;
  };

  conversation: {
    externalId: string;
  };

  error?: {
    code?: number;
    title?: string;
    message?: string;
  } | null;

  rawPayload: Record<string, any>;
}
