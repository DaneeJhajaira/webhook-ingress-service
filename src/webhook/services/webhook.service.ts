import { Injectable, Logger } from '@nestjs/common';
import { WebhookPublisherService } from './webhook-publisher.service';
import { mapMetaMessageToCanonicalEvent } from '../mappers/meta-webhook.mapper';
import { mapMetaStatusToCanonicalEvent } from '../mappers/meta-status-webhook.mapper';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly webhookPublisherService: WebhookPublisherService,
  ) {}

  async processWebhook(body: any): Promise<void> {
    const entries = body?.entry ?? [];

    for (const entry of entries) {
      const changes = entry?.changes ?? [];

      for (const change of changes) {
        const value = change?.value;
        const metadata = value?.metadata;
        const contacts = value?.contacts ?? [];
        const messages = value?.messages ?? [];
        const statuses = value?.statuses ?? [];

        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          const contact = contacts[i] ?? contacts[0];

          const event = mapMetaMessageToCanonicalEvent({
            message,
            contact,
            metadata,
          });

          this.logger.log(
            `Publicando evento ${event.eventType} para messageId=${event.message.messageId}`,
          );

          await this.webhookPublisherService.publishWhatsappMessageReceived(
            event,
          );
        }

        for (const status of statuses) {
          const event = mapMetaStatusToCanonicalEvent({
            status,
            metadata,
          });

          this.logger.log(
            `Publicando evento ${event.eventType} para messageId=${event.message.messageId} status=${event.message.status}`,
          );

          await this.webhookPublisherService.publishWhatsappMessageStatus(
            event,
          );
        }
      }
    }
  }
}
