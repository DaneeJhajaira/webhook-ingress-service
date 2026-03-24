import { randomUUID } from 'crypto';
import {
  MessageType,
  WhatsappMessageReceivedEvent,
} from '../../shared/contracts/whatsapp-message-received.contract';

function resolveMessageType(type?: string): MessageType {
  const allowed: MessageType[] = [
    'text',
    'image',
    'video',
    'audio',
    'document',
    'sticker',
    'interactive',
    'button',
  ];

  if (type && allowed.includes(type as MessageType)) {
    return type as MessageType;
  }

  return 'unknown';
}

function unixToIso(timestamp?: string): string {
  if (!timestamp) {
    return new Date().toISOString();
  }

  const value = Number(timestamp);
  if (Number.isNaN(value)) {
    return new Date().toISOString();
  }

  return new Date(value * 1000).toISOString();
}

export function mapMetaMessageToCanonicalEvent(params: {
  message: any;
  contact?: any;
  metadata?: any;
}): WhatsappMessageReceivedEvent {
  const { message, contact, metadata } = params;
  const messageType = resolveMessageType(message?.type);

  const isText = messageType === 'text';
  const isMedia = ['image', 'video', 'audio', 'document', 'sticker'].includes(
    messageType,
  );

  const mediaPayload = isMedia ? message?.[messageType] ?? null : null;

  return {
    eventId: randomUUID(),
    eventType: 'whatsapp.message.received',
    occurredAt: new Date().toISOString(),

    source: {
      channel: 'whatsapp',
      provider: 'meta',
      phoneNumberId: metadata?.phone_number_id ?? '',
      displayPhoneNumber: metadata?.display_phone_number ?? '',
    },

    message: {
      messageId: message?.id ?? '',
      direction: 'inbound',
      type: messageType,
      timestamp: unixToIso(message?.timestamp),
    },

    contact: {
      waId: contact?.wa_id ?? message?.from ?? '',
      phone: message?.from ?? contact?.wa_id ?? '',
      name: contact?.profile?.name ?? undefined,
    },

    conversation: {
      externalId: message?.from ?? '',
    },

    content: {
      text: isText
        ? {
            body: message?.text?.body ?? '',
          }
        : null,

      media: isMedia
        ? {
            providerMediaId: mediaPayload?.id ?? '',
            mimeType: mediaPayload?.mime_type ?? undefined,
            fileName: mediaPayload?.filename ?? null,
            caption: mediaPayload?.caption ?? null,
          }
        : null,
    },

    rawPayload: message,
  };
}