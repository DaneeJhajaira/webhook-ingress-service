import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const brokers = configService
            .get<string>('KAFKA_BROKERS', 'localhost:9092')
            .split(',');

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get<string>(
                  'KAFKA_CLIENT_ID',
                  'webhook-ingress',
                ),
                brokers,
              },
              producerOnlyMode: true,
            },
          };
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
