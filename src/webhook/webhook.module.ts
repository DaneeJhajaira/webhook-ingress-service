import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { WebhookService } from './services/webhook.service';
import { WebhookPublisherService } from './services/webhook-publisher.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, WebhookPublisherService],
})
export class WebhookModule {}