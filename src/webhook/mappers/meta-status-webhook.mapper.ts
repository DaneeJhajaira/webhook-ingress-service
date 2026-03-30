import { randomUUID } from 'crypto';
import {
  WhatsappMessageStatusEvent,
  WhatsappOutboundStatus,
} from '../../shared/contracts/whatsapp-message-status.contract';

function resolveStatus(status?: string): WhatsappOutboundStatus {
  const allowed: WhatsappOutboundStatus[] = [
    'sent',
    'delivered',
    'read',
    'failed',
    'deleted',
    'warning',
  ];

  if (status && allowed.includes(status as WhatsappOutboundStatus)) {
    return status as WhatsappOutboundStatus;
  }

  return 'unknown';
}

function unixToIso(timestamp?: string): string {
  if (!timestamp) return new Date().toISOString();

  const value = Number(timestamp);
  if (Number.isNaN(value)) return new Date().toISOString();

  return new Date(value * 1000).toISOString();
}

export function mapMetaStatusToCanonicalEvent(params: {
  status: any;
  metadata?: any;
}): WhatsappMessageStatusEvent {
  const { status, metadata } = params;
  const resolvedStatus = resolveStatus(status?.status);
  const firstError = status?.errors?.[0];

  return {
    eventId: randomUUID(),
    eventType: 'whatsapp.message.status',
    occurredAt: new Date().toISOString(),

    source: {
      channel: 'whatsapp',
      provider: 'meta',
      phoneNumberId: metadata?.phone_number_id ?? '',
      displayPhoneNumber: metadata?.display_phone_number ?? '',
    },

    message: {
      messageId: status?.id ?? '',
      status: resolvedStatus,
      timestamp: unixToIso(status?.timestamp),
    },

    recipient: {
      waId: status?.recipient_id ?? '',
    },

    conversation: {
      externalId: status?.recipient_id ?? '',
    },

    error: firstError
      ? {
          code: firstError?.code,
          title: firstError?.title,
          message: firstError?.message,
        }
      : null,

    rawPayload: status,
  };
}
