import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { WhatsappMessageReceivedEvent } from '../../shared/contracts/whatsapp-message-received.contract';
import { WhatsappMessageStatusEvent } from '../../shared/contracts/whatsapp-message-status.contract';

@Injectable()
export class WebhookPublisherService implements OnModuleInit {
  private readonly receivedTopic: string;
  private readonly statusTopic: string;

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.receivedTopic = this.configService.get<string>(
      'KAFKA_TOPIC_WHATSAPP_RECEIVED',
      'whatsapp.message.received',
    );

    this.statusTopic = this.configService.get<string>(
      'KAFKA_TOPIC_WHATSAPP_STATUS',
      'whatsapp.message.status',
    );
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async publishWhatsappMessageReceived(
    event: WhatsappMessageReceivedEvent,
  ): Promise<void> {
    await firstValueFrom(this.kafkaClient.emit(this.receivedTopic, event));
  }

  async publishWhatsappMessageStatus(
    event: WhatsappMessageStatusEvent,
  ): Promise<void> {
    await firstValueFrom(this.kafkaClient.emit(this.statusTopic, event));
  }
}
