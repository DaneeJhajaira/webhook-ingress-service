export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'sticker'
  | 'interactive'
  | 'button'
  | 'unknown';

export interface WhatsappMessageReceivedEvent {
  eventId: string;
  eventType: 'whatsapp.message.received';
  occurredAt: string;

  source: {
    channel: 'whatsapp';
    provider: 'meta';
    phoneNumberId: string;
    displayPhoneNumber: string;
  };

  message: {
    messageId: string;
    direction: 'inbound';
    type: MessageType;
    timestamp: string;
  };

  contact: {
    waId: string;
    phone: string;
    name?: string;
  };

  conversation: {
    externalId: string;
  };

  content: {
    text?: {
      body: string;
    } | null;

    media?: {
      providerMediaId: string;
      mimeType?: string;
      fileName?: string | null;
      caption?: string | null;
    } | null;
  };

  rawPayload: Record<string, any>;
}