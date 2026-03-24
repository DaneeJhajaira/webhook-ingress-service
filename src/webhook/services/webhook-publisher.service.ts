import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { WhatsappMessageReceivedEvent } from '../../shared/contracts/whatsapp-message-received.contract';

@Injectable()
export class WebhookPublisherService implements OnModuleInit {
  private readonly topic: string;

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.topic = this.configService.get<string>(
      'KAFKA_TOPIC_WHATSAPP_RECEIVED',
      'whatsapp.message.received',
    );
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async publishWhatsappMessageReceived(
    event: WhatsappMessageReceivedEvent,
  ): Promise<void> {
    await firstValueFrom(this.kafkaClient.emit(this.topic, event));
  }
}